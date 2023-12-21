const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//UPDTE
router.put("/:id", async (req, res) =>
{
    if (req.body.userId === req.params.id)
    {
        if (req.body.password == req.params.id)
        {
            const salt = await (bcrypt.genSalt(10));
            req.body.password = await bcrypt.hash(req.body.password.salt);
        }
        try
        {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },
                { new: true });
            res.status(200).json(updateUser);
        } catch (err)
        {
            res.status(500).json(err);
        }
    } else
    {
        response.status(401).json("you can update only your account!");
    }
});


module.exports = router;

//DELETE
router.delete("/:id", async (req, res) =>
{
    if (req.body.userId === req.params.id)
    {
        try
        {
            const user = await User.findById(req.params.id);
            const { password, ...others } = user._doc;
            try
            {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been delete");
            } catch (err)
            {
                res.status(500).json(err);
            }
        } catch (err) { response.status(404).json("User not found!"); }
    } else
    {
        response.status(401).json("you can delete only your account!");
    }
});


//GET USER
router.get("/:id", async (req, res) =>
{
    try
    {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);

    } catch (err)
    {
        res.status(500).json(err);
    }
});