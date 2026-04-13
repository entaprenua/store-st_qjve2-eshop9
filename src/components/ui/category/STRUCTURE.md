# Category Components Architecture

## Overview

Codeless, composable category components with automatic depth-controlled recursion. Users compose UI by nesting components without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read from context, no manual data passing
2. **Composable** - Section primitives that users combine freely
3. **Auto-Nesting** - Nested `SubcategoryList` automatically fetches children
4. **Depth-Controlled** - Recursion stops at configurable `maxDepth`
5. **Atomic** - Raw value components, user provides styling
6. **Layout Flexible** - Layout is controlled by user via Grid, Flex, etc.

## Directory Structure

```
components/ui/category/
├── index.ts                    # Barrel exports
├── category-context.tsx         # Context + useCategory() hook
├── category-root.tsx           # Category component
├── category-list.tsx           # CategoryList + CategoryListView + SubcategoryList
├── category-tree.tsx           # CategoryTree + CategoryTreeView + CategoryTreeSubcategories
├── category-sections.tsx        # Atomic primitives
├── category-metadata.tsx       # Metadata components
└── STRUCTURE.md               # This file
```

## Core Pattern

```tsx
<CategoryList maxDepth={3}>
  <Flex class="space-y-4">
    <CategoryListView>
      <Category class="border rounded-lg p-4">
        <Flex class="items-center gap-3">
          <CategoryDepth class="bg-muted w-6 h-6 rounded..." />
          <CategoryName class="font-medium" />
          <CategorySlug class="text-xs ml-auto" />
        </Flex>
        
        <SubcategoryList>
          <Flex class="ml-8 mt-3 space-y-2">
            <CategoryListView>
              <Category class="border-l-2 border-muted pl-4 py-2">
                <CategoryDepth class="bg-muted w-5 h-5 rounded..." />
                <CategoryName />
                
                <SubcategoryList>
                  <Flex class="ml-6 mt-2">
                    <CategoryListView>
                      <Category class="border-l-2...">
                        <CategoryDepth class="w-4 h-4..." />
                        <CategoryName />
                      </Category>
                    </CategoryListView>
                  </Flex>
                </SubcategoryList>
              </Category>
            </CategoryListView>
          </Flex>
        </SubcategoryList>
      </Category>
    </CategoryListView>
  </Flex>
</CategoryList>
```

### How Auto-Nesting Works

1. `CategoryList` at top level fetches root categories
2. Each iteration provides `CollectionItemContext` with current category
3. `Category` wraps in `ParentCategoryContext.Provider` with category ID
4. Nested `SubcategoryList` reads parent ID from context
5. `SubcategoryList` fetches children, wraps each in `Category`
6. Pattern repeats until `maxDepth` is reached

## Components

### CategoryList

Fetches root categories with depth control.

```typescript
type CategoryListProps = {
  storeId?: string
  maxDepth?: number          // Default: 3
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}
```

### CategoryListView

Pass-through wrapper for layout. Layout (Grid, Flex) goes inside `CategoryList`.

```typescript
type CategoryListViewProps = {
  class?: string
  children?: JSX.Element
}
```

### SubcategoryList

Fetches children of current category. Automatically stops at `maxDepth`.

```typescript
type SubcategoryListProps = {
  storeId?: string
  page?: number
  pageSize?: number
  class?: string
  children?: JSX.Element
}
```

### Category

Wraps content, provides `CategoryContext` and `ParentCategoryContext`.

```typescript
type CategoryProps = {
  class?: string
  children?: JSX.Element
}
```

## Contexts

### CategoryDepthContext

Tracks current depth for recursion control.

```typescript
type CategoryDepthContext = {
  currentDepth: Accessor<number>
  maxDepth: Accessor<number>
}

export const useCategoryDepth = (): CategoryDepthContext
```

### CategoryContext

Provides access to category data for section components.

```typescript
type CategoryContextValue = {
  data: Accessor<CategoryProps | null>
  id: Accessor<string | null>
  name: Accessor<string | null>
  slug: Accessor<string | null>
  image: Accessor<string | null>
  level: Accessor<number | null>
  parentId: Accessor<string | null>
  path: Accessor<string | null>
  depth: Accessor<number | null>
  isRoot: Accessor<boolean>
}

export const useCategory = (): CategoryContextValue
```

### ParentCategoryContext

Provides parent category ID for `SubcategoryList`.

```typescript
export const useParentCategoryId = (): string | undefined
```

## Atomic Section Primitives

All components read from `useCategory()` or `useCategoryData()`. User composes styling.

```typescript
<CategoryName class?: string />
<CategorySlug class?: string />
<CategoryImage class?: string; alt?: string />
<CategoryLevel class?: string />
<CategoryDepth class?: string />        // Depth from path or level
<CategoryPath class?: string />
<CategoryParentId class?: string />
<CategoryId class?: string />
```

## Usage Examples

### Simple Grid

```tsx
<CategoryList>
  <Grid cols={4} gap={4}>
    <CategoryListView>
      <Category class="p-4 border rounded-lg">
        <CategoryImage class="w-full h-32 object-cover rounded" />
        <CategoryName class="font-semibold mt-2" />
        <CategorySlug class="text-xs text-muted" />
      </Category>
    </CategoryListView>
  </Grid>
</CategoryList>
```

### Recursive Tree (Depth-Controlled)

```tsx
<CategoryList maxDepth={3}>
  <div class="space-y-4">
    <CategoryListView>
      <Category class="border rounded-lg p-4">
        <Flex class="items-center gap-3">
          <CategoryDepth class="bg-muted w-8 h-8 rounded-full flex items-center justify-center" />
          <CategoryName class="font-bold text-lg" />
          <CategorySlug class="text-xs text-muted ml-auto" />
        </Flex>
        
        <SubcategoryList>
          <div class="ml-8 mt-4 space-y-2 border-l-2 border-muted pl-4">
            <CategoryListView>
              <Category class="py-2">
                <Flex class="items-center gap-2">
                  <CategoryDepth class="bg-muted w-6 h-6 rounded-full text-xs" />
                  <CategoryName />
                </Flex>
                
                <SubcategoryList>
                  <div class="ml-6 mt-2">
                    <CategoryListView>
                      <Category class="py-1 text-sm">
                        <Flex class="items-center gap-2">
                          <CategoryDepth class="bg-muted w-5 h-5 rounded-full text-xs" />
                          <CategoryName />
                        </Flex>
                      </Category>
                    </CategoryListView>
                  </div>
                </SubcategoryList>
              </Category>
            </CategoryListView>
          </div>
        </SubcategoryList>
      </Category>
    </CategoryListView>
  </div>
</CategoryList>
```

### Styling by Depth

```tsx
<CategoryList>
  <div class="space-y-2">
    <CategoryListView>
      <Category>
        <Flex 
          class={`
            items-center gap-3 p-3 border rounded-lg
            ${/* Depth-based styling could be applied via CategoryDepth value */}
          `}
        >
          <CategoryDepth class="bg-muted w-8 h-8 rounded-full flex items-center justify-center font-medium" />
          <div class="flex-1">
            <CategoryName class="font-medium" />
            <CategorySlug class="text-xs text-muted" />
          </div>
        </Flex>
        
        <SubcategoryList>
          <div class="ml-8 mt-2">
            <CategoryListView>
              <Category>
                <Flex class="items-center gap-2 p-2 border-l-2 border-muted pl-4">
                  <CategoryDepth class="bg-muted w-6 h-6 rounded-full text-xs" />
                  <CategoryName class="text-sm" />
                </Flex>
                
                <SubcategoryList>
                  <div class="ml-6 mt-1">
                    <CategoryListView>
                      <Category class="py-1 pl-4 border-l border-muted">
                        <Flex class="items-center gap-2">
                          <CategoryDepth class="bg-muted w-5 h-5 rounded-full text-xs" />
                          <CategoryName class="text-sm" />
                        </Flex>
                      </Category>
                    </CategoryListView>
                  </div>
                </SubcategoryList>
              </Category>
            </CategoryListView>
          </div>
        </SubcategoryList>
      </Category>
    </CategoryListView>
  </div>
</CategoryList>
```

### With Category Metadata

```tsx
<CategoryList>
  <Grid cols={3} gap={6}>
    <CategoryListView>
      <Category class="group">
        <div class="relative overflow-hidden rounded-lg">
          <CategoryImage class="w-full aspect-square object-cover transition-transform group-hover:scale-105" />
        </div>
        
        <div class="mt-3">
          <CategoryName class="font-semibold" />
          <CategorySlug class="text-sm text-muted" />
          <Flex class="items-center gap-2 mt-2 text-xs text-muted">
            <CategoryLevel />
            <span>•</span>
            <CategoryDepth />
          </Flex>
        </div>
        
        <SubcategoryList>
          <div class="mt-4 pt-4 border-t">
            <CategoryListView>
              <Category class="py-2 border-b last:border-0">
                <CategoryName class="text-sm" />
              </Category>
            </CategoryListView>
          </div>
        </SubcategoryList>
      </Category>
    </CategoryListView>
  </Grid>
</CategoryList>
```

## API Alignment

| Endpoint | Component Usage |
|----------|-----------------|
| `GET /stores/:id/categories?root=true` | `CategoryList` fetches root |
| `GET /stores/:id/categories?childrenOf=:id` | `SubcategoryList` fetches children |
| `GET /stores/:id/categories?tree=true` | Full tree (future enhancement) |

## Key Features

### Depth Control

- `CategoryList` sets `maxDepth` (default: 3)
- `SubcategoryList` checks `currentDepth < maxDepth` before rendering
- Deepest level (`maxDepth`) won't render `SubcategoryList`

### Parent ID Resolution

1. `CategoryList` fetches root categories
2. `Category` provides `ParentCategoryContext` with its ID
3. `SubcategoryList` reads parent ID from context
4. `SubcategoryList` fetches children via `categoriesApi.getByParent()`

### Collection Integration

- Uses `Collection` and `CollectionView` for data fetching and iteration
- `CollectionItemContext` provides per-item data
- `useCollectionItem()` reads current category

## Migration Notes

### Old → New Pattern

```tsx
// OLD (manual nesting, 3 levels)
<CategoryItems storeId="123">
  <CategoryItemsView>
    <Category>
      <CategoryName />
      <CategoryItems storeId="123" parentId={category.id}>
        <CategoryItemsView>
          <Category>
            <CategoryName />
            <CategoryItems storeId="123" parentId={category.id}>
              ...
            </CategoryItems>
          </Category>
        </CategoryItemsView>
      </CategoryItems>
    </Category>
  </CategoryItemsView>
</CategoryItems>

// NEW (automatic nesting, depth-controlled)
<CategoryList maxDepth={3}>
  <CategoryListView>
    <Category>
      <CategoryName />
      <SubcategoryList>
        <CategoryListView>
          <Category>
            <CategoryName />
            <SubcategoryList>
              <CategoryListView>
                <Category>
                  <CategoryName />
                  {/* maxDepth reached, stops here */}
                </Category>
              </CategoryListView>
            </SubcategoryList>
          </Category>
        </CategoryListView>
      </SubcategoryList>
    </Category>
  </CategoryListView>
</CategoryList>
```

## Future Enhancements

### Drag-and-Drop Reordering

```tsx
// Future: Sortable category list
<CategoryList sortable>
  <CategoryListView>
    <Category draggable>
      ...
    </Category>
  </CategoryListView>
</CategoryList>
```

## CategoryTree Component

Fetches the full category tree in a single API call using `?tree=true`.

### Components

| Component | Purpose |
|-----------|---------|
| `CategoryTree` | Fetches full tree via `?tree=true` |
| `CategoryTreeView` | Iterates over categories |
| `CategoryTreeSubcategories` | Renders subcategories for current item |

### Props

```typescript
type CategoryTreeProps = {
  maxDepth?: number
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  children?: JSX.Element
}
```

Note: `storeId` is automatically read from `useStoreId()` context.

### Usage

```tsx
<CategoryTree>
  <Grid cols={3} gap={3}>
    <CategoryTreeView class="space-y-4">
      <Col class="m-3">
        <Category>
          <CategoryImage class="h-20 w-20" />
          <CategoryName />
          <CategoryTreeSubcategories>
            <Category>
              <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <CategoryImage class="w-16 h-16 rounded object-cover" />
                <CategoryName class="text-lg font-semibold block" />
                <CategoryTreeSubcategories>
                  <Category>
                    <div class="mt-4 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                      <CategoryTreeSubcategories>
                        <Category>
                          <div class="bg-gray-50 rounded p-3 border border-gray-200">
                            <CategoryImage class="w-10 h-10 rounded object-cover" />
                            <CategoryName class="font-medium block" />
                            <CategoryTreeSubcategories>
                              <Category>
                                <div class="mt-2 ml-4 space-y-1">
                                  <CategoryTreeSubcategories>
                                    <Category>
                                      <div class="text-sm text-gray-600 flex items-center gap-2 py-1">
                                        <span class="w-2 h-2 rounded-full bg-gray-400" />
                                        <CategoryName class="block" />
                                      </div>
                                    </Category>
                                  </CategoryTreeSubcategories>
                                </div>
                              </Category>
                            </CategoryTreeSubcategories>
                          </div>
                        </Category>
                      </CategoryTreeSubcategories>
                    </div>
                  </Category>
                </CategoryTreeSubcategories>
              </div>
            </Category>
          </CategoryTreeSubcategories>
        </Category>
      </Col>
    </CategoryTreeView>
  </Grid>
</CategoryTree>
```

### How It Works

1. `CategoryTree` fetches full tree in single API call via `?tree=true`
2. `CategoryTreeView` iterates over root categories (reads from Collection context)
3. `CategoryTreeSubcategories` reads `category.subcategories` array from current item
4. Each `CategoryTreeSubcategories` is wrapped in `<Category>` to provide context
5. Atomic components (`CategoryName`, `CategoryImage`) read from context
6. Nested `CategoryTreeSubcategories` + `<Category>` pattern repeats recursively
7. Pattern continues until `maxDepth` is reached

### CategoryTree vs CategoryList

| Aspect | CategoryTree | CategoryList |
|--------|--------------|--------------|
| API calls | 1 (fetches full tree) | N+1 (root + per level) |
| Data structure | Nested `{ subcategories: [] }` | Flat array with `parentId` |
| Best for | Static trees, SEO pages | Dynamic/filterable trees |
| Flexibility | Less flexible | More flexible per-level queries |

### API Alignment

| Endpoint | Component Usage |
|----------|-----------------|
| `GET /stores/:id/categories?tree=true` | `CategoryTree` fetches full tree |
