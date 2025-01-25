import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Iconify } from '@components/common';
import { Input } from '@components/form/Input';

export interface TreeNodeProps {
  node: TreeNode;
  searchTerm: string;
  onNodeFocus?: (node: TreeNode) => void;
}

export interface TreeNode {
  id: number | string;
  key: string;
  label: string;
  value: string;
  children?: TreeNode[];

  [key: string]: any;
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
        className={`h-7 ease-linear transition-all duration-200 cursor-pointer hover:bg-sky-100 flex items-center ${isMatch ? 'font-bold' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasChildren && (
          <div className="flex items-center p-1 bg-transparent hover:bg-sky-100 rounded  border-0 cursor-pointer">
            {isOpen ? (
              <Iconify icon="mdi:chevron-down" />
            ) : (
              <Iconify icon="mdi:chevron-right" />
            )}
          </div>
        )}
        <div className="text-neutral-900 font-normal">{node.label}</div>
      </div>
      {isOpen && hasChildren && (
        <div className="h-7 pl-9 hover:bg-sky-100 flex items-center">
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

const filterTree = (nodes: TreeNode[], term: string): TreeNode[] => {
  return nodes
    .map((node) => {
      if (!term) return null;
      if (node.value.toLowerCase().includes(term.toLowerCase())) {
        return node;
      }

      if (node.children) {
        const filteredChildren = filterTree(node.children, term);
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }

      return null;
    })
    .filter((node) => node !== null);
};

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeFocus,
}: TreeViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredData = useMemo(
    () => filterTree(data, searchTerm),
    [data, filterTree, searchTerm],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef?.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);
  return (
    <div className="relative" ref={containerRef}>
      <Input
        placeholder="Search"
        onInputChange={(value) => setSearchTerm(value)}
        className="border-gray-400 hover:border-blue-200 focus:border-blue-200 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border rounded-md transition duration-300 ease"
        value={searchTerm}
      />
      {filteredData.length !== 0 && (
        <div
          className="py-2 absolute top-11 w-full z-10 bg-white rounded text-sm"
          style={{
            boxShadow:
              'rgba(0, 0, 0, 0.3) 0px 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 4px 14px 0px',
          }}
        >
          {filteredData.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              searchTerm={searchTerm}
              onNodeFocus={onNodeFocus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
