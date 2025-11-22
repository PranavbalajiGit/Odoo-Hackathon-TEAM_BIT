'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add TRANSFER to Operation type enum
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        ALTER TYPE "enum_Operations_type" ADD VALUE IF NOT EXISTS 'TRANSFER';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add TRANSFER to Sequence type enum
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        ALTER TYPE "enum_Sequences_type" ADD VALUE IF NOT EXISTS 'TRANSFER';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: PostgreSQL doesn't support removing enum values directly
    // You would need to recreate the enum types if you want to rollback
    // This is intentionally left empty as enum removal is complex
  }
};


