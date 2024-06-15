import db from "../Database/DB.js";
//@desc get all users
//@route GET api/users/
export const getUsers = async (req, res, next) => {
  try {
    const results = await db.query("SELECT * FROM `users`");
    res.status(200).json(results[0]);
  } catch (e) {
    console.log(e);
    const error = new Error(e.code || "unknown error occured");
    next(error);
  }
};

//@desc get user by id
//@route GET /api/posts/:id
export const getSingleUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    console.log(req.params.id);
    if (id) {
      const results = await db.query(`SELECT * FROM users WHERE id=${id}`);
      res.status(200).json(results[0]);
      return;
    }
    throw (new Error("id is not in valid format").status = 400);
  } catch (e) {
    console.log(e);
    const error = new Error(e.code || e.message || "unknown error occured");
    error.status = e.status;
    next(error);
  }
};

//@desc create a user
//@route POST api/users/
export const createUser = async (req, res, next) => {
  const body = req.body;

  try {
    if (body.name && body.username && body.password && body.role) {
      const results = await db.query(
        "INSERT INTO `users`(`name`, `role`, `username`, `password`) VALUES (?,?,?,?)",
        [body.name, body.role, body.username, body.password]
      );
      res.status(200).json(results);
      return;
    }

    throw (Error("insufficent data to process the request").status = 400);
  } catch (e) {
    console.log(e);
    const error = new Error(e.code || e.message || "unknown error occured");
    error.status = e.status;
    next(error);
  }
};

//@desc update user
//@route PUT api/users/
export const updateUser = async (req, res, next) => {
  const body = req.body;
  try {
    if (body.uid && body.name && body.username && body.password && body.role) {
      const results = await db.query(
        "UPDATE `users` SET `name`=?,`role`=?,`username`=?,`password`=? WHERE `id`=?",
        [body.name, body.role, body.username, body.password, body.uid]
      );
      res.status(200).json(results);
      return;
    }
    throw (new Error("insufficent data to process the request").status = 400);
  } catch (e) {
    const error = new Error(e.code || e.message || "unknown error occured");
    next(error);
  }
};

//@desc delete user
//@route DELETE api/users/:id
export const deleteUser = (req, res, next) => {
  try {
    const uid = parseInt(req.params.id);
    if (uid) {
      const results = db.query(`DELETE FROM users WHERE id=${uid}`);
      res.status(200).json(results);
      return;
    }
    throw new Error("id is not in valid format");
  } catch (e) {
    const error = new Error(e.code || e.message || "unknown error occured");
    next(error);
  }
};
