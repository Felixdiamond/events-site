'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCheck, UserCircle } from 'lucide-react';

export interface MessageProps {
  content: string;
  isAdmin: boolean;
  timestamp: Date;
  isRead?: boolean;
}

export const MessageBubble: React.FC<MessageProps> = ({
  content,
  isAdmin,
  timestamp,
  isRead = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`mb-4 ${isAdmin ? 'ml-12' : 'mr-12'} group`}
    >
      <div className="flex items-end gap-2">
        {isAdmin && (
          <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center mb-1">
            <UserCircle size={18} className="text-primary" />
          </div>
        )}
        
        <div className={`flex-1 ${isAdmin ? 'order-first' : 'order-last'}`}>
          <div
            className={`relative rounded-lg px-4 py-3 ${
              isAdmin
                ? 'bg-gradient-to-r from-primary-light/80 to-primary/80 text-white rounded-bl-none shadow-md'
                : 'bg-white/10 backdrop-blur-sm text-white rounded-br-none border border-white/10'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
            
            <div className={`flex items-center justify-${isAdmin ? 'start' : 'end'} mt-1 text-xs text-white/60`}>
              {format(timestamp, 'h:mm a')}
              {isAdmin && (
                <span className="ml-1 transition-colors">
                  <CheckCheck size={12} className={isRead ? 'text-blue-400' : 'text-white/60'} />
                </span>
              )}
            </div>
          </div>
        </div>
        
        {!isAdmin && (
          <div className="bg-white/10 rounded-full w-8 h-8 flex items-center justify-center mb-1 border border-white/5">
            <span className="text-xs font-semibold text-white/70">You</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 