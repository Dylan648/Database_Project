import express from "express"
import cors from "cors"

import {
  getSweatshirts,
  getSweatshirt,
  getGlasswares,
  getGlassware,
  getShirts,
  getShirt,
  getHats,
  getHat,
  addSweatshirt,
  addShirt,
  addGlassware,
  addHat,
  getAllMerch,
  deleteMerchItem,
  addMerchItem,
} from "./database.js"

const app = express()

app.use(express.json())
app.use(cors())

app.delete("/merch/:type/:id", async (req, res) => {
  const { id, type } = req.params

  try {
    // Call the delete function for the item based on its type
    const result = await deleteMerchItem(id, type)

    // Check if the deletion was successful
    if (result.affectedRows >= 0) {
      res.status(200).json({ message: "Item deleted successfully" })
    } else {
      res.status(404).json({ message: "Item not found" })
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete item", error: error.message })
  }
})

app.get("/merch", async (req, res) => {
  try {
    const merchData = await getAllMerch()
    res.status(200).json(merchData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/sweatshirts", async (req, res) => {
  const sweatshirts = await getSweatshirts()
  res.send(sweatshirts)
})

app.get("/sweatshirts/:id", async (req, res) => {
  const id = req.params.id
  const sweatshirts = await getSweatshirt(id)
  res.send(sweatshirts)
})

app.post("/sweatshirts", async (req, res) => {
  const {
    year,
    inventory,
    og_price,
    curr_price,
    color_swap,
    back_design,
    type,
  } = req.body

  if (
    !year ||
    !inventory ||
    og_price == null ||
    curr_price == null ||
    !color_swap ||
    !back_design ||
    !type
  ) {
    return res.status(400).json({ error: "All fields are required." })
  }

  try {
    const newSweatshirt = await addSweatshirt(
      year,
      inventory,
      og_price,
      curr_price,
      color_swap,
      back_design,
      type
    )

    res.status(201).json({
      message: "Sweatshirt added successfully!",
      id: newSweatshirt,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/shirts", async (req, res) => {
  const shirts = await getShirts()
  res.send(shirts)
})

app.get("/shirts/:id", async (req, res) => {
  const id = req.params.id
  const shirt = await getShirt(id)
  res.send(shirt)
})

app.post("/shirts", async (req, res) => {
  const { year, inventory, og_price, curr_price, type, event, sleeveLen } =
    req.body

  if (
    !year ||
    !inventory ||
    og_price == null ||
    curr_price == null ||
    !type ||
    !event ||
    sleeveLen == null
  ) {
    return res.status(400).json({ error: "All fields are required." })
  }

  try {
    const newShirt = await addShirt(
      year,
      inventory,
      og_price,
      curr_price,
      type,
      event,
      sleeveLen
    )

    res.status(201).json({
      message: "Shirt added successfully!",
      id: newShirt,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/glasswares", async (req, res) => {
  const glasswares = await getGlasswares()
  res.send(glasswares)
})

app.get("/glasswares/:id", async (req, res) => {
  const id = req.params.id
  const glassware = await getGlassware(id)
  res.send(glassware)
})

app.post("/glasswares", async (req, res) => {
  const { year, inventory, og_price, curr_price, type, glasswareType, design } =
    req.body

  if (
    !year ||
    !inventory ||
    og_price == null ||
    curr_price == null ||
    !type ||
    !glasswareType ||
    !design
  ) {
    return res.status(400).json({ error: "All fields are required." })
  }

  try {
    const newGlassware = await addGlassware(
      year,
      inventory,
      og_price,
      curr_price,
      type,
      glasswareType,
      design
    )

    res.status(201).json({
      message: "Glassware added successfully!",
      id: newGlassware,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/hats", async (req, res) => {
  const hats = await getHats()
  res.send(hats)
})

app.get("/hats/:id", async (req, res) => {
  const id = req.params.id
  const hat = await getHat(id)
  res.send(hat)
})

app.post("/hats", async (req, res) => {
  const { year, inventory, og_price, curr_price, type, color, design } =
    req.body

  if (
    !year ||
    !inventory ||
    og_price == null ||
    curr_price == null ||
    !type ||
    !color ||
    !design
  ) {
    return res.status(400).json({ error: "All fields are required." })
  }

  try {
    const newHat = await addHat(
      year,
      inventory,
      og_price,
      curr_price,
      type,
      color,
      design
    )

    res.status(201).json({
      message: "Hat added successfully!",
      id: newHat,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/merch", async (req, res) => {
  const { year_, inventory, original_price, current_price, type_ } = req.body

  // Validate all required fields
  if (!year_ || !inventory || !original_price || !current_price || !type_) {
    return res.status(400).json({ error: "Required fields are missing." })
  }

  try {
    const newItem = await addMerchItem(
      year_,
      inventory,
      original_price,
      current_price,
      type_
    )
    res.status(201).json(newItem) // Return the added item with the ID
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("something broke!")
})

app.listen(8080, () => {
  console.log("Server is listening on port 8080")
})
