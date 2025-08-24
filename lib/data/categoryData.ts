"use server";

import dbConnect from "../mongodb";
import { Category, ICategory } from "../../models/Category";
import { MenuItem } from "../../models/MenuItem";
import mongoose from "mongoose";

// Category CRUD operations
export async function getCategories() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ order: 1, name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCafeCategories() {
  try {
    await dbConnect();
    const categories = await Category.find({menu: "cafe"}).sort({ order: 1, name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching cafe categories:", error);
    throw new Error("Failed to fetch cafe categories");
  }
}

export async function getRestaurantCategories() {
  try {
    await dbConnect();
    const categories = await Category.find({menu: "restaurant"}).sort({ order: 1, name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching restaurant categories:", error);
    throw new Error("Failed to fetch restaurant categories");
  }
}

export async function createCategory(categoryData: ICategory) {
  try {
    await dbConnect();
    if (categoryData.order === undefined) {
      const lastCategory = await Category.findOne({menu: categoryData.menu})
        .sort({ order: -1 })
        .limit(1);

      categoryData.order = lastCategory ? (lastCategory.order || 0) + 1 : 0;
    }
    const newCategory = new Category({
      ...categoryData,
      _id: new mongoose.Types.ObjectId(),
    });
    await newCategory.save();
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(id: string, categoryData: ICategory) {
  try {
    await dbConnect();
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new Error("Category not found");
    }

    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(id: string) {
  try {
    await dbConnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the category
      const deletedCategory = await Category.findByIdAndDelete(id).session(
        session
      );
      if (!deletedCategory) {
        throw new Error("Category not found");
      }

      // Delete all menu items in this category
      await MenuItem.deleteMany({ categoryId: id }).session(session);

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

export async function reorderCategories(orderedIds: string[]) {
  console.log(orderedIds);
  try {
    await dbConnect();

    // Update each category with its new order
    const updatePromises = orderedIds.map((id, index) => {
      return Category.findByIdAndUpdate(id, { order: index });
    });

    await Promise.all(updatePromises);

    return { success: true, message: "Categories reordered successfully" };
  } catch (error) {
    console.error("Error reordering categories:", error);
    throw new Error("Failed to reorder categories");
  }
}