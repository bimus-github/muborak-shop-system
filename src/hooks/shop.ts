import {
  createShop,
  deleteReceivedProduct,
  getShop,
  getShops,
  receiveProduct,
  updateReceivedProduct,
  updateShop,
} from "@/actions/shop";
import { Product, Shop } from "@/models/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useGetShops = (from: Date) => {
  const [productName, setProductName] = useState("");
  const queryClient = useQueryClient();
  return {
    ...useQuery<{ shops: Shop[] }>({
      queryKey: ["shops"],
      queryFn: async () => {
        const res = await getShops(from).then((res) => ({
          shops: JSON.parse(res?.shops || "") as Shop[],
        }));
        if (res.shops) {
          res.shops?.forEach((shop) => {
            queryClient.setQueryData(["shops", shop._id], {
              success: true,
              shop: shop,
            });
          });
        }
        return res;
      },
      initialData: () => queryClient.getQueryData(["shops"]),
    }),
    productName,
    setProductName,
  };
};

export const useCreateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Shop) =>
      createShop(data).then((res) => ({
        ...res,
        shop: JSON.parse(res?.shop || "") as Shop,
      })),
    onSuccess: (res) =>
      queryClient.setQueryData(["shops"], (data: { shops: Shop[] }) => ({
        shops: [res.shop || [], ...(data?.shops || [])],
      })),
  });
};

export const useUpdateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { shop: Shop; index: number }) =>
      updateShop(data.shop).then((res) => ({
        ...res,
        shop: JSON.parse(res?.shop || "") as Shop,
        index: data.index,
      })),
    onSuccess: (res) =>
      queryClient.setQueryData(["shops"], (data: { shops: Shop[] }) => {
        const newData = [...(data?.shops || [])];
        if (res.success) newData[res.index] = res.shop;
        return { shops: newData };
      }),
  });
};

export const useDeleteProductFromShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { shopId: string; product: Product }) =>
      deleteReceivedProduct({
        product: data.product,
        shopId: data.shopId,
      }).then((res) => ({
        ...res,
        shopId: data.shopId,
        product: JSON.parse(res?.product || "") as Product,
        shop: JSON.parse(res?.shop || "") as Shop,
      })),
    onSuccess(data) {
      if (data.success) {
        queryClient.setQueryData(["shops", data.shopId], () => ({
          success: true,
          shop: {
            ...data.shop,
            products: data.shop?.products?.filter(
              (product) => product._id !== data.product._id
            ),
          },
        }));
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
  });
};

export const useGetShopById = (data: { shopId: string }) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [`shops`, data.shopId],
    queryFn: () =>
      getShop(data.shopId).then((res) => ({
        ...res,
        shop: JSON.parse(res?.shop || "") as Shop | undefined,
      })),
    initialData: () => {
      const shop = (
        queryClient.getQueryData(["shops"]) as { shops: Shop[] }
      )?.shops?.find((shop) => shop._id === data.shopId);
      return { success: true, shop: shop };
    },
    enabled: !!data.shopId,
  });
};

export const useCreateProductToShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { shopId: string; product: Product }) =>
      receiveProduct({ product: data.product, shopId: data.shopId }).then(
        (res) => ({
          ...res,
          product: data.product,
          shopId: data.shopId,
          shop: JSON.parse(res?.shop || "") as Shop,
        })
      ),
    onSuccess(res) {
      if (res.success) {
        queryClient.setQueryData(
          ["shops", res.shopId],
          ({ shop }: { success: true; shop: Shop }) => ({
            success: true,
            shop: {
              ...shop,
              products: [...[res.product], ...(shop?.products || [])],
            },
          })
        );
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
  });
};

export const useUpdateProductOfShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { shopId: string; product: Product; index: number }) =>
      updateReceivedProduct({
        product: data.product,
        shopId: data.shopId,
      }).then((res) => ({
        ...res,
        index: data.index,
        shopId: data.shopId,
        product: data.product,
        shop: JSON.parse(res?.shop || "") as Shop,
      })),
    onSuccess(data) {
      if (data.success) {
        queryClient.setQueryData(["shops", data.shopId], () => ({
          success: true,
          shop: {
            ...data.shop,
            products: data.shop?.products?.map((product) =>
              product._id === data.product._id ? data.product : product
            ),
          },
        }));
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
  });
};
