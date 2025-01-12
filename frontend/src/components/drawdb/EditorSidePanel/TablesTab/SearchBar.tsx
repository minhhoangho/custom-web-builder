import { useMemo } from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { useSelect } from 'src/containers/Editor/hooks';
// import { TreeSelect } from "@douyinfe/semi-ui";
// import { IconSearch } from "@douyinfe/semi-icons";
import { ObjectType } from '@constants/editor';

interface RenderTree {
  id: string;
  label: string;
  children?: readonly RenderTree[];
}

export default function SearchBar({ tables }) {
  const { setSelectedElement } = useSelect();
  // const { t } = useTranslation();

  const treeData = useMemo(() => {
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

  const renderTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.label}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      // searchPosition="trigger"
      sx={{ maxHeight: 400, overflow: 'auto' }}
      // treeData={treeData}
      // prefix={<Iconify icon="mdi:search"}/>}
      // emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
      // filterTreeNode
      // placeholder={t("search")}
      onNodeSelect={(node) => {
        const { tableId, id, children } = node;

        setSelectedElement((prev) => ({
          ...prev,
          id: tableId,
          open: true,
          element: ObjectType.TABLE,
        }));
        document
          .getElementById(`scroll_table_${tableId}`)
          .scrollIntoView({ behavior: 'smooth' });

        if (!children) {
          document
            .getElementById(`scroll_table_${tableId}_input_${id}`)
            .focus();
        }
      }}
      // onChangeWithObject
      className="w-full"
    >
      {treeData.map((node: RenderTree) => renderTree(node))}
    </TreeView>
  );
}
