import React, { useState } from 'react';
import { Iconify } from '@components/common';

export interface TreeNodeProps {
  node: TreeNode;
  searchTerm: string;
  onNodeFocus?: (node: TreeNode) => void;
}

export interface TreeNode {
  id: number;
  key: string;
  label: string;
  value: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
  onNodeFocus?: (node: TreeNode) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  searchTerm,
  onNodeFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const isMatch = node.value.toLowerCase().includes(searchTerm.toLowerCase());

  const handleFocus = (nodeData: TreeNode) => {
    onNodeFocus?.(nodeData); // Call the focus handler with the current node
  };

  return (
    <div>
      <div
        className={`flex justify-between items-center ${isMatch ? 'font-bold' : ''}`}
      >
        <span>{node.label}</span>
        {hasChildren && (
          <button onClick={() => setIsOpen(!isOpen)} className="ml-2">
            {isOpen ? (
              <Iconify icon="mdi:chevron-up" />
            ) : (
              <Iconify icon="mdi:chevron-down" />
            )}
          </button>
        )}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4">
          {node.children?.map((childNode: TreeNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              searchTerm={searchTerm}
              onNodeFocus={() => handleFocus(childNode)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeFocus,
}: TreeViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="my-2 mx-3">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-9 border-gray-400 hover:border-blue-300 focus:border-blue-500 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-1 transition duration-300 ease shadow-sm"
      />
      <div>
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            searchTerm={searchTerm}
            onNodeFocus={onNodeFocus}
          />
        ))}
      </div>
    </div>
  );
};
