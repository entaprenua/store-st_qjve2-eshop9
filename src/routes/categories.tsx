import { CategoryTree, Category, CategoryTreeView, CategoryTreeSubcategories, CategoryName, CategorySlug, CategoryImage } from "~/components/ui/category"
import { Grid, Col } from "~/components/ui/grid"

export default function CategoryTreeDemo() {
  return (
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-2">Category Tree Demo</h1>
        <p class="text-gray-600 mb-8">Full category tree fetched in one API call</p>

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
                        <div class="flex items-center gap-4">
                          <CategoryImage class="w-16 h-16 rounded object-cover" />
                          <div class="flex-1">
                            <CategoryName class="text-lg font-semibold block" />
                          </div>
                        </div>
                        <CategoryTreeSubcategories>
                          <Category>
                            <div class="mt-4 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                              <CategoryTreeSubcategories>
                                <Category>
                                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                                    <div class="flex items-center gap-3">
                                      <CategoryImage class="w-10 h-10 rounded object-cover" />
                                      <CategoryName class="font-medium block" />
                                    </div>
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
      </div>
    </div>
  )
}
