-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_category_id_fkey`;

-- DropIndex
DROP INDEX `transaction_category_id_fkey` ON `transaction`;

-- AlterTable
ALTER TABLE `transaction` MODIFY `category_id` CHAR(26) NULL;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
