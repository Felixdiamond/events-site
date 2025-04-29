'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Loader2, Trash2, Pencil, X, Save, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
  imageCount?: number;
}

export default function CategoriesAdmin() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for adding/editing
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // State for editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  // State for deleting
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      // Get image counts for each category
      const categoriesWithCounts = await Promise.all(
        data.map(async (category: Category) => {
          try {
            const imagesResponse = await fetch(`/api/images?category=${encodeURIComponent(category.name)}`);
            const imagesData = await imagesResponse.json();
            return {
              ...category,
              imageCount: Array.isArray(imagesData) ? imagesData.length : 0
            };
          } catch (err) {
            console.error(`Error fetching images for category ${category.name}:`, err);
            return {
              ...category,
              imageCount: 0
            };
          }
        })
      );
      
      setCategories(categoriesWithCounts);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadCategories();
    }
  }, [session]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setIsAddingCategory(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add category');
      }

      await loadCategories(); // Reload categories
      setNewCategoryName(''); // Clear input
      setShowAddModal(false); // Close modal
      toast({
        title: "Category added",
        description: `"${newCategoryName}" has been added successfully.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    if (!editedName.trim()) {
      setError('Category name is required');
      return;
    }

    setIsSavingEdit(true);
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category');
      }

      await loadCategories(); // Reload categories
      setEditingCategory(null); // Exit edit mode
      toast({
        title: "Category updated",
        description: `Category has been renamed to "${editedName}".`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      await loadCategories(); // Reload categories
      setCategoryToDelete(null); // Close delete modal
      toast({
        title: "Category deleted",
        description: `"${categoryToDelete.name}" has been deleted.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                Category Management
              </h1>
            </div>
            <p className="mt-2 text-white/60">
              Create, edit, and delete image categories
            </p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Category
          </Button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400"
            >
              {error}
              <button 
                onClick={() => setError(null)} 
                className="ml-2 text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4 inline" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories List */}
        <div className="bg-[linear-gradient(110deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_30%,rgba(255,255,255,0.05))] backdrop-blur-sm p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-6">All Categories</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <p>No categories found. Create your first category to get started.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Category Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Images</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCategory?.id === category.id ? (
                            <Input 
                              value={editedName} 
                              onChange={(e) => setEditedName(e.target.value)}
                              className="max-w-xs bg-white/10 border-white/20 focus:border-primary-light"
                            />
                          ) : (
                            <span className="text-white">{category.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            href={`/admin/gallery?category=${encodeURIComponent(category.name)}`}
                            className="text-primary hover:underline"
                          >
                            {category.imageCount} images
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {editingCategory?.id === category.id ? (
                            <div className="flex justify-end items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setEditingCategory(null)} 
                                disabled={isSavingEdit}
                                className="text-white/60 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={handleSaveEdit} 
                                disabled={isSavingEdit}
                                className="flex items-center gap-1"
                              >
                                {isSavingEdit ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Save className="h-3 w-3" />
                                )}
                                Save
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setEditingCategory(category);
                                  setEditedName(category.name);
                                }} 
                                className="text-white/60 hover:text-white"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setCategoryToDelete(category)} 
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-md bg-secondary rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Category</h2>
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="categoryName" className="text-sm text-white/60">
                    Category Name
                  </label>
                  <Input
                    id="categoryName"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="w-full"
                    onClick={handleAddCategory}
                    disabled={isAddingCategory}
                  >
                    {isAddingCategory ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Add Category'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-black/20"
                    onClick={() => setShowAddModal(false)}
                    disabled={isAddingCategory}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-md bg-secondary rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Delete Category</h2>
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white"
                  onClick={() => setCategoryToDelete(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-white/70">
                  Are you sure you want to delete the category <span className="font-semibold text-white">"{categoryToDelete.name}"</span>?
                  {categoryToDelete.imageCount && categoryToDelete.imageCount > 0 ? (
                    <span className="block mt-2 text-yellow-400">
                      Warning: This category contains {categoryToDelete.imageCount} images. Deleting this category will not delete the images, but they will no longer be associated with this category.
                    </span>
                  ) : (
                    ''
                  )}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteCategory}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Delete Category'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-black/20"
                    onClick={() => setCategoryToDelete(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
