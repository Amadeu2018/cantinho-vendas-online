
import { useIsMobile } from "@/hooks/use-mobile";
import ProductsTableView from "./products-list/ProductsTableView";
import ProductsMobileView from "./products-list/ProductsMobileView";

interface ProductsListProps {
  products: any[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onUpdateStock: (product: any, change: number) => void;
  getCategoryName: (product: any) => string;
}

const ProductsList = ({
  products,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  getCategoryName
}: ProductsListProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ProductsMobileView
        products={products}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdateStock={onUpdateStock}
        getCategoryName={getCategoryName}
      />
    );
  }

  return (
    <ProductsTableView
      products={products}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={onSort}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onUpdateStock={onUpdateStock}
      getCategoryName={getCategoryName}
    />
  );
};

export default ProductsList;
