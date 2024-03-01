const express = require('express')
const { createCategoryController } = require('../controllers/categoryController')

const router = express.Router()

/* ----- routes ----- */
// create category
router.post('/careate-category', createCategoryController)

module.exports = router