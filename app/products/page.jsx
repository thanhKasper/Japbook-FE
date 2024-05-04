"use client";

import Filter from "@/components/Filter";
import Navigation from "@/components/Navigation";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Card from "@/components/Card";
import { v4 as uuid } from "uuid";
import { FilterDispatch, FilterState } from "@/context/Context";
import Footer from "@/components/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { be_url, web_link } from "@/config_var";
import axios from "axios";

const totalProduct = 84;

const Products = () => {
  const filter = useContext(FilterState);
  const dispatch = useContext(FilterDispatch)
  const [page, setPage] = useState(3);
  const [sort, setSort] = useState({ kind: "price", order: "asc" }); // Kind: name | price, order: asc | desc
  const [productList, setProductList] = useState([]);
  const [list, setList] = useState();
  const productPerPage = 12;
  const finalPage = Math.ceil(totalProduct / productPerPage);
  let mergeArray = null;

  mergeArray = [].concat(filter.genre);

  

  useEffect(() => {
    const getFilterProducts = async () => {
      console.log("useEffect filter is called");
      try {
        const fetchFilterProducts = await axios.get(
          `${be_url}/filterProducts?name=${filter.name}&price_start=${filter.priceRange[0]}&price_end=${filter.priceRange[1]}&genre_type=${filter.genre}&order=${sort.order}`
        );
        // console.log(fetchFilterProducts);
        setProductList(fetchFilterProducts.data);
      } catch (e) {
        console.log(e);
      }
    };
    getFilterProducts();
  }, [filter, sort]);


  // console.log("Filter dispatch in product page ", filter);
  // console.log("Genre list to sort ", list)
  // console.log("sort order", sort)



  return (
    <>
      <Navigation path={["Ecommerce", "Products"]} bgColor={"#F6F6F6"} />
      <section className="responsive-layout my-10 flex flex-col items-center md:flex-row md:items-start gap-4">
        <Filter />
        <main className="w-full">
          <p className="font-semibold">Applied Filters:</p>
          <div className="w-full flex flex-wrap gap-2 mt-4">
            {mergeArray.map(ele => (
              <Tag
                key={uuid()}
                borderRadius="full"
                variant="outline"
                colorScheme="gray"
                size="lg"
              >
                <TagLabel className="text-black">{ele}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    dispatch({ type: "RemoveTag", name: ele });
                  }}
                />
              </Tag>
            ))}
            {filter.priceRange.length > 0 && (
              <Tag
                key={uuid()}
                borderRadius="full"
                variant="outline"
                colorScheme="gray"
                size="lg"
              >
                <TagLabel className="text-black">{`From ${filter.priceRange[0]} đ to ${filter.priceRange[1]} đ`}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    dispatch({ type: "RemovePriceRange" });
                  }}
                />
              </Tag>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <p>Showing {productList.length == 0 ? 0 : 1}-{productList.length} of {productList.length} results</p>
            <Select
              onValueChange={e => {
                switch (e) {
                  // case "name-asc":
                  //   setSort({ kind: "name", order: "asc" });
                  //   break;
                  // case "name-desc":
                  //   setSort({ kind: "name", order: "desc" });
                  //   break;
                  case "price-asc":
                    setSort({ kind: "price", order: "asc" });
                    break;
                  case "price-desc":
                    setSort({ kind: "price", order: "desc" });
                    break;
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="name-asc">{"Name (A-Z)"}</SelectItem>
                <SelectItem value="name-desc">{"Name (Z-A)"}</SelectItem> */}
                <SelectItem value="price-asc">
                  {"Price (low - high)"}
                </SelectItem>
                <SelectItem value="price-desc">
                  {"Price (high - low)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-20">
            {productList.length ? (
              productList.map(book => (
                <div key={uuid()} className="flex justify-center">
                  <Card
                    productId={book.id}
                    productName={book.name}
                    isInStock={book.status == "InStock" ? true : false}
                    price={book.price}
                    imgUrl={book.image}
                  />
                </div>
              ))) : <span></span>}
          </div>
          {productList.length == 0 && (<div className="w-full">
            <p className="text-center py-72">No matching result here</p>
          </div>)}
          <Pagination className="mt-5">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  // href={`${web_link}/products?page=${
                  //   page > 1 ? page - 1 : page
                  // }`}
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    setPage(oldPage =>
                      oldPage - 1 > 0 ? oldPage - 1 : oldPage
                    );
                    // console.log("This prev is clicked")
                  }}
                />
              </PaginationItem>
              {/*Always have first page*/}
              <PaginationItem>
                <PaginationLink
                  href={`${web_link}/products?page=1`}
                  onClick={e => {
                    e.preventDefault();
                    setPage(1);
                    // console.log("This prev is clicked")
                  }}
                  isActive={page == 1 ? true : false}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/*First ellipsis appears only when current page is greater than or equal to 4 */}
              {page >= 4 && finalPage > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {((page < 4 && finalPage > 5) || finalPage <= 5) && (
                <>
                  {finalPage > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`${web_link}/products?page=2`}
                        onClick={e => {
                          e.preventDefault();
                          setPage(2);
                          // console.log("This prev is clicked")
                        }}
                        isActive={page == 2 ? true : false}
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {finalPage > 3 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`${web_link}/products?page=3`}
                        onClick={e => {
                          e.preventDefault();
                          setPage(3);
                          // console.log("This prev is clicked")
                        }}
                        isActive={page == 3 ? true : false}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {finalPage > 4 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`${web_link}/products?page=4`}
                        onClick={e => {
                          e.preventDefault();
                          setPage(4);
                          // console.log("This prev is clicked")
                        }}
                        isActive={page == 4 ? true : false}
                      >
                        4
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}
              {page + 2 < finalPage && finalPage > 5 && (
                <>
                  {page >= 4 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`${web_link}/products?page=${page - 1}`}
                        onClick={e => {
                          e.preventDefault();
                          setPage(prevPage => prevPage - 1);
                          // console.log("This prev is clicked")
                        }}
                      >
                        {page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {page >= 4 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`${web_link}/products?page=${page}`}
                        onClick={e => {
                          e.preventDefault();
                          setPage(prevPage => prevPage);
                          // console.log("This prev is clicked")
                        }}
                        isActive
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {page >= 4 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`${web_link}/products?page=${page + 1}`}
                        onClick={e => {
                          e.preventDefault();
                          setPage(prevPage => prevPage + 1);
                          // console.log("This prev is clicked")
                        }}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}

              {finalPage - 3 > 1 && page + 2 >= finalPage && finalPage > 5 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href={`${web_link}/products?page=${finalPage - 3}`}
                      onClick={e => {
                        e.preventDefault();
                        setPage(finalPage - 3);
                        // console.log("This prev is clicked")
                      }}
                      isActive={page == finalPage - 3 ? true : false}
                    >
                      {finalPage - 3}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href={`${web_link}/products?page=${finalPage - 2}`}
                      onClick={e => {
                        e.preventDefault();
                        setPage(finalPage - 2);
                        // console.log("This prev is clicked")
                      }}
                      isActive={page == finalPage - 2 ? true : false}
                    >
                      {finalPage - 2}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href={`${web_link}/products?page=${finalPage - 1}`}
                      onClick={e => {
                        e.preventDefault();
                        setPage(finalPage - 1);
                        // console.log("This prev is clicked")
                      }}
                      isActive={page == finalPage - 1 ? true : false}
                    >
                      {finalPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              {/*Second ellipsis appears only when current page + 3 is smaller than the final page */}
              {page + 2 < finalPage && finalPage > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/*final page only exist if products cannot fit inside one page*/}
              {finalPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href={`${web_link}/products?page=${finalPage}`}
                    onClick={e => {
                      e.preventDefault();
                      setPage(finalPage);
                      // console.log("This prev is clicked")
                    }}
                    isActive={page == finalPage ? true : false}
                  >
                    {finalPage}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href={`${web_link}/products?page=${
                    page * 12 > totalProduct ? page : page + 1
                  }`}
                  onClick={e => {
                    e.preventDefault();
                    setPage(prevPage =>
                      prevPage * 12 >= totalProduct ? prevPage : prevPage + 1
                    );
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </section>
      <Footer bgColor={"#F6F6F6"} />
    </>
  );
};

export default Products;
