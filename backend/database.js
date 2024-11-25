import mysql from "mysql2"

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "inventory_manager",
  })
  .promise()

export async function deleteMerchItem(id, type) {
  switch (type) {
    case "sweatshirt":
      await pool.query("DELETE FROM sweatshirt WHERE Item_ID = ?", [id])
      break
    case "shirt":
      await pool.query("DELETE FROM shirt WHERE Item_ID = ?", [id])
      break
    case "glassware":
      await pool.query("DELETE FROM glassware WHERE Item_ID = ?", [id])
      break
    case "hat":
      await pool.query("DELETE FROM hat WHERE Item_ID = ?", [id])
      break
    default:
      throw new Error("Unknown merch item type")
  }

  // Finally, delete from the merch_item table
  const result = await pool.query("DELETE FROM merch_item WHERE ID = ?", [id])
  return result
}

//GET commands!

export const getAllMerch = async () => {
  const [result] = await pool.query("SELECT * FROM merch_item")
  return result
}

export async function getSweatshirts() {
  const [result] = await pool.query("SELECT * FROM sweatshirt")
  return result
}

export async function getSweatshirt(id) {
  const result = await pool.query(
    `
        SELECT * 
        FROM sweatshirt
        WHERE Item_ID = ?
        `,
    [id]
  )
  return result[0]
}

export async function getGlasswares() {
  const [result] = await pool.query("SELECT * FROM glassware")
  return result
}

export async function getGlassware(id) {
  const [result] = await pool.query(
    `
        SELECT * 
        FROM glassware
        WHERE Item_ID = ?
        `,
    [id]
  )
  return result[0]
}

export async function getShirts() {
  const [result] = await pool.query("SELECT * FROM shirt")
  return result
}

export async function getShirt(id) {
  const [result] = await pool.query(
    `
          SELECT * 
          FROM shirt
          WHERE Item_ID = ?
          `,
    [id]
  )
  return result[0]
}

export async function getHats() {
  const [result] = await pool.query("SELECT * FROM hat")
  return result
}

export async function getHat(id) {
  const [result] = await pool.query(
    `
          SELECT * 
          FROM hat
          WHERE Item_ID = ?
          `,
    [id]
  )
  return result[0]
}

//POST commands!

export async function addMerchItem(
  year,
  inventory,
  og_price,
  curr_price,
  type
) {
  const [result] = await pool.query(
    `
      INSERT INTO merch_item (year_, inventory, original_price, current_price, type_)
      VALUES (?, ?, ?, ?, ?)
      `,
    [year, inventory, og_price, curr_price, type]
  )
  return result.insertId
}

export async function addSweatshirt(
  year,
  inventory,
  og_price,
  curr_price,
  color_swap,
  back_design,
  type
) {
  const itemId = await addMerchItem(
    year,
    inventory,
    og_price,
    curr_price,
    "sweatshirt"
  )

  await pool.query(
    `
      INSERT INTO sweatshirt (Item_ID, color_swap, back_design, type_)
      VALUES (?, ?, ?, ?)
      `,
    [itemId, color_swap, back_design, type]
  )

  return itemId
}

// Add Shirt
export async function addShirt(
  year,
  inventory,
  originalPrice,
  currentPrice,
  type,
  event,
  sleeveLen
) {
  const itemId = await addMerchItem(
    year,
    inventory,
    originalPrice,
    currentPrice,
    type
  )
  await pool.query(
    `
      INSERT INTO shirt (Item_ID, event_, sleeve_len)
      VALUES (?, ?, ?)
      `,
    [itemId, event, sleeveLen]
  )
  return itemId
}

// Add Glassware
export async function addGlassware(
  year,
  inventory,
  originalPrice,
  currentPrice,
  type,
  glasswareType,
  design
) {
  const itemId = await addMerchItem(
    year,
    inventory,
    originalPrice,
    currentPrice,
    type
  )
  await pool.query(
    `
      INSERT INTO glassware (Item_ID, type_, design)
      VALUES (?, ?, ?)
      `,
    [itemId, glasswareType, design]
  )
  return itemId
}

// Add Hat
export async function addHat(
  year,
  inventory,
  originalPrice,
  currentPrice,
  type,
  color,
  design
) {
  const itemId = await addMerchItem(
    year,
    inventory,
    originalPrice,
    currentPrice,
    type
  )
  await pool.query(
    `
      INSERT INTO hat (Item_ID, color, design)
      VALUES (?, ?, ?)
      `,
    [itemId, color, design]
  )
  return itemId
}
