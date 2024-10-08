import { StoryTree, StoryTreeItem } from "../../types"

export function walkTree(
  tree: StoryTree,
  levels: string[],
  fn: (item: StoryTreeItem) => void,
  leafOnly: boolean
): void {
  const key = levels[0]
  if (!key) {
    return
  }

  const item = tree.find((item) => item.subId === key)
  if (!item) {
    return
  }

  if (!leafOnly || levels.length === 1) {
    fn(item)
  }

  walkTree(item.children, levels.slice(1), fn, leafOnly)
}

export function getLastLeafId(node: StoryTreeItem): string {
  if (node.isExpanded && node.children && node.children.length) {
    return getLastLeafId(node.children[node.children.length - 1])
  }

  return node.id
}

export function getParentId(nodes: StoryTree, nodeId: string, parentId: string | null): string | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      return parentId
    }

    if (nodes[i].isExpanded && nodes[i].children && nodes[i].children.length) {
      const foundId = getParentId(nodes[i].children, nodeId, nodes[i].id)

      if (foundId) {
        return foundId
      }
    }
  }

  return null
}

export function getPrevId(nodes: StoryTree, nodeId: string, parentId: string | null): string | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      if (i === 0) {
        return parentId
      }

      return getLastLeafId(nodes[i - 1])
    }

    if (nodes[i].isExpanded && nodes[i].children && nodes[i].children.length) {
      const foundId = getPrevId(nodes[i].children, nodeId, nodes[i].id)

      if (foundId) {
        return foundId
      }
    }
  }

  return null
}

export function getSubtree(nodes: StoryTree, nodeId: string): StoryTree {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      return nodes[i].children
    }

    const res = getSubtree(nodes[i].children, nodeId)

    if (res.length > 0) {
      return res
    }
  }

  return []
}

export function getFirstLink(nodes: StoryTree, nodeId: string): StoryTreeItem {
  if (nodes[0].isLinkable) {
    return nodes[0]
  }

  return getFirstLink(nodes[0].children, nodeId)
}

export function getFirstChildId(nodes: StoryTree, nodeId: string): string | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      if (nodes[i].isExpanded && nodes[i].children && nodes[i].children.length) {
        return nodes[i].children[0].id
      }
    }

    if (nodes[i].isExpanded && nodes[i].children && nodes[i].children.length) {
      const foundId = getFirstChildId(nodes[i].children, nodeId)

      if (foundId) {
        return foundId
      }
    }
  }
  return null
}

export function getNextId(nodes: StoryTree, nodeId: string, closestOmmer: string | null): string | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      if (nodes[i].isExpanded && nodes[i].children && nodes[i].children.length) {
        return nodes[i].children[0].id
      }

      if (nodes[i + 1]) {
        return nodes[i + 1].id
      }

      return closestOmmer
    }

    if (nodes[i].isExpanded && nodes[i].children && nodes[i].children.length) {
      const foundId = getNextId(nodes[i].children, nodeId, nodes[i + 1] ? nodes[i + 1].id : closestOmmer)

      if (foundId) {
        return foundId
      }
    }
  }

  return null
}

export function getEndId(nodes: StoryTree): string {
  const endNode = nodes[nodes.length - 1]

  if (endNode.isExpanded && endNode.children && endNode.children.length) {
    return getEndId(endNode.children)
  }

  return endNode.id
}

export function toggleIsExpanded(arr: StoryTree, toggledNode: StoryTreeItem): StoryTree {
  return arr.map((node, order) => {
    const newNode = { ...node }
    if (newNode.id === toggledNode.id) {
      newNode.isExpanded = !newNode.isExpanded
    }

    if (toggledNode.id === "+" && order === 0) {
      newNode.isExpanded = true
    }

    if (toggledNode.id === "-") {
      newNode.isExpanded = false
    }

    if (newNode.children?.length) {
      newNode.children = toggleIsExpanded(
        newNode.children,
        newNode.id === toggledNode.id ? ({ id: newNode.isExpanded ? "+" : "-" } as StoryTreeItem) : toggledNode
      )
    }

    return newNode
  })
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...funcArgs: Parameters<T>) => void {
  let timerId: number | undefined

  return function (this: unknown, ...args) {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }

    timerId = window.setTimeout(() => {
      fn.apply(this, args)
      timerId = undefined
    }, delay)
  }
}
