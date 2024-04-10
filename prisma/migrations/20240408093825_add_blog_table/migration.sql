/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blog_shop_key" ON "Blog"("shop");
