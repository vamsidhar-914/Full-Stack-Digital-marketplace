import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const YourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;
  if (user?.role === "admin") return true;
  if (!user) return false;
  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  const ownProductFileIds = products.map((prod) => prod.product_files).flat();
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  const purchasedProductIds = orders
    .map((order) => {
      return order.products.map((prod) => {
        if (typeof prod === "string")
          return req.payload.logger.error(
            "search depth not sufficient to find purchased file ids"
          );
        return typeof prod.product_files === "string"
          ? prod.product_files
          : prod.product_files.id;
      });
    })
    .filter(Boolean)
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductIds],
    },
  };
};

export const Product_files: CollectionConfig = {
  slug: "product_files",
  hooks: {
    beforeChange: [addUser],
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    read: YourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
