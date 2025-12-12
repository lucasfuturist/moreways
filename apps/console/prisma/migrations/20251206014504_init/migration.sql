/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `form_schemas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "form_schemas_slug_key" ON "form_schemas"("slug");
