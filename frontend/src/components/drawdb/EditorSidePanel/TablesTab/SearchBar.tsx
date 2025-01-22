import { useMemo } from 'react';
import { TreeNode, TreeView } from '@components/common';
import { useSelect } from 'src/containers/Editor/hooks';
import { ObjectType } from '@constants/editor';
import { DTable } from 'src/data/interface';

// interface RenderTree {
//   id: string;
//   label: string;
//   children?: readonly RenderTree[];
// }

export default function SearchBar({ tables }: { tables: DTable[] }) {
  const { setSelectedElement } = useSelect();
  // const { t } = useTranslation();

  const treeData: TreeNode[] = useMemo(() => {
    return tables.map(({ id, name: parentName, fields }, i) => {
      const children = fields.map(({ name }, j) => ({
        tableId: id,
        id: `${j}`,
        label: name,
        value: name,
        key: `${i}-${j}`,
      }));

      return {
        tableId: id,
        id: `${i}`,
        label: parentName,
        value: parentName,
        key: `${i}`,
        children,
      };
    });
  }, [tables]);

  console.log('TreeData', treeData);
  // const renderTree = (node: RenderTree) => (
  //   <TreeItem key={node.id} nodeId={node.id} label={node.label}>
  //     {Array.isArray(node.children)
  //       ? node.children.map((node) => renderTree(node))
  //       : null}
  //   </TreeItem>
  // );

  return (
    <TreeView
      // searchPosition="trigger"

      // treeData={treeData}
      // prefix={<Iconify icon="mdi:search"}/>}
      // emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
      // filterTreeNode
      // placeholder={t("search")}
      data={treeData}
      onNodeFocus={(nodeData: TreeNode) => {
        const node = treeData.find((n) => n.id === nodeData.id);
        if (!node) return;
        const { tableId, id, children } = node;

        setSelectedElement((prev) => ({
          ...prev,
          id: tableId,
          open: true,
          element: ObjectType.TABLE,
        }));
        document
          .getElementById(`scroll_table_${tableId}`)
          ?.scrollIntoView({ behavior: 'smooth' });

        if (!children) {
          document
            .getElementById(`scroll_table_${tableId}_input_${id}`)
            ?.focus();
        }
      }}
      // onChangeWithObject
      // className="max-w-xl min-w-[150px] "
    ></TreeView>
  );
}
