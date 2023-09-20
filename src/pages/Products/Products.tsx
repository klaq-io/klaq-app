import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { PageLayout } from "../../layouts";
import {
  useDeleteProductItem,
  useFetchProductItems,
} from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { NewProducts } from "./NewProducts";
import { EditProduct } from "./EditProduct";
import { DangerModal, DropdownMenu, KebabMenu } from "components";
import { shortenString } from "../../utils/utils";
import { ProductItem } from "../../redux/Products/slices";

export const Products = () => {
  const intl = useIntl();

  const [{ isLoading }, fetchProducts] = useFetchProductItems();
  const productItems = useSelector(getAllProducts);

  const [, deleteProduct] = useDeleteProductItem();

  const [openSidePanel, setOpenSidePanel] = useState(false);
  const [openEditSidePanel, setEditOpenSidePanel] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState("");

  const handleOpenSidePanel = () => {
    setOpenSidePanel(true);
  };

  const handleEditProduct = (productId: string) => {
    setEditOpenSidePanel(true);
    setProductToEdit(productId);
  };

  const handleModalOpening = (productId: string) => {
    setOpenDeleteModal(true);
    setProductToEdit(productId);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    setOpenDeleteModal(false);
  };

  const optionsDropdownMenu = (productId: string) => [
    {
      name: "products.my-products.button.edit",
      onClick: () => handleEditProduct(productId),
      icon: PencilSquareIcon,
    },
    {
      name: "products.my-products.button.delete",
      onClick: () => handleModalOpening(productId),
      icon: TrashIcon,
      iconColor: "text-danger-500 group-hover:text-danger-500",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "products.title",
            })}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {intl.formatMessage({
              id: "products.description",
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex-1 mt-10">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                {intl.formatMessage({
                  id: "products.my-products.header",
                })}{" "}
                ({productItems.length})
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {intl.formatMessage({
                  id: "products.my-products.description",
                })}
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={handleOpenSidePanel}
                type="button"
                className="block rounded-md bg-klaq-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
              >
                {intl.formatMessage({
                  id: "products.new-product.submit",
                })}
              </button>
            </div>
          </div>

          {productItems && productItems.length ? (
            <>
              <div className="-mx-4 mt-4 sm:mx-0 sm:rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {intl.formatMessage({
                          id: "products.my-products.title",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "products.my-products.short-description",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "products.my-products.vta-rate",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "products.my-products.price",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-center text-sm font-semibold text-gray-900"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productItems.map((product: ProductItem) => (
                      <tr key={product.id}>
                        <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">
                            {product.title}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <div className="font-medium text-gray-500">
                            {shortenString(35, product.description)}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <div className="font-medium text-gray-500">
                            {product.vtaRate} %
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <div className="font-medium text-gray-500">
                            {product.price} €
                          </div>
                        </td>
                        <td className="relative py-3.5 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                          <KebabMenu
                            items={optionsDropdownMenu(product.id)}
                            buttonSize="md"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="mt-10">
              <button
                onClick={handleOpenSidePanel}
                type="button"
                className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
              >
                <PlusIcon
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                />

                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  {intl.formatMessage({
                    id: "products.no-product",
                  })}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {intl.formatMessage({
                    id: "products.get-started",
                  })}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
      <DangerModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onClick={() => handleDeleteProduct(productToEdit)}
        title={intl.formatMessage({
          id: "products.delete-product.modal.title",
        })}
        message={intl.formatMessage(
          {
            id: "products.delete-product.modal.message",
          },
          {
            productTitle: productItems.find(
              (product: any) => product.id === productToEdit
            )?.title,
          }
        )}
        button1={intl.formatMessage({
          id: "products.delete-product.modal.button.delete",
        })}
        button2={intl.formatMessage({
          id: "products.delete-product.modal.button.cancel",
        })}
      />
      <EditProduct
        productId={productToEdit}
        openSidePanel={openEditSidePanel}
        setOpenSidePanel={setEditOpenSidePanel}
      />
      <NewProducts
        openSidePanel={openSidePanel}
        setOpenSidePanel={setOpenSidePanel}
      />
    </PageLayout>
  );
};

export default Products;
