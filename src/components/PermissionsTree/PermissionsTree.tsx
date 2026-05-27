import { useState } from 'react';
import type { ActionType, BlockType, PermissionGrantType, UnitTreeItem } from 'types/index';

import styles from './PermissionsTree.module.scss';

type PermissionsTreeProps = {
  tree: UnitTreeItem[];
  selectedPermissions: PermissionGrantType[];
  onChange: (permissions: PermissionGrantType[]) => void;
};

const BLOCKS: { value: BlockType | 'all'; label: string }[] = [
  { value: 'safety', label: 'Безопасность' },
  { value: 'quality', label: 'Качество' },
  { value: 'production', label: 'Производство' },
  { value: 'economy', label: 'Затраты' },
  { value: 'culture', label: 'Культура' },
  { value: 'all', label: 'Все блоки' },
];

const ACTIONS: { value: ActionType; label: string }[] = [
  { value: 'view', label: 'Просмотр' },
  { value: 'manage', label: 'Управление' },
  { value: 'manage_permissions', label: 'Управление правами' },
];

function TreeNode({
  node,
  selectedPermissions,
  onChange,
}: {
  node: UnitTreeItem;
  selectedPermissions: PermissionGrantType[];
  onChange: (permissions: PermissionGrantType[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasPermission = (block: BlockType | 'all', action: ActionType) => {
    return selectedPermissions.some(
      (p) => p.unit_id === node.id && p.block === block && p.action === action
    );
  };

  const togglePermission = (block: BlockType | 'all', action: ActionType, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, { unit_id: node.id, block, action }]);
    } else {
      onChange(
        selectedPermissions.filter(
          (p) => !(p.unit_id === node.id && p.block === block && p.action === action)
        )
      );
    }
  };

  const hasAnyPermissionInNode = selectedPermissions.some((p) => p.unit_id === node.id);

  return (
    <div className={styles.treeNode}>
      <div className={styles.nodeHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
        <span className={styles.nodeName}>
          {node.name} {hasAnyPermissionInNode ? '(выбраны права)' : ''}
        </span>
      </div>

      {isExpanded && (
        <div className={styles.nodeContent}>
          <div className={styles.permissionsMatrix}>
            {BLOCKS.map((block) => (
              <div key={block.value} className={styles.blockRow}>
                <span className={styles.blockName}>{block.label}:</span>
                <div className={styles.actionsGroup}>
                  {ACTIONS.map((action) => (
                    <label key={action.value} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={hasPermission(block.value, action.value)}
                        onChange={(e) =>
                          togglePermission(block.value, action.value, e.target.checked)
                        }
                      />
                      {action.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isExpanded && node.children && node.children.length > 0 && (
        <div className={styles.childrenContainer}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedPermissions={selectedPermissions}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PermissionsTree({
  tree,
  selectedPermissions,
  onChange,
}: PermissionsTreeProps) {
  if (tree.length === 0) return <p>Загрузка структуры...</p>;

  return (
    <div className={styles.treeContainer}>
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          selectedPermissions={selectedPermissions}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
