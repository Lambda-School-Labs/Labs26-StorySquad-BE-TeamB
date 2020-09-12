const router = require('express').Router();
const Stories = require('./storyModel');
const authRequired = require('../middleware/authRequired');
const {
  storyValidation,
  storyUpdateValidation,
} = require('../middleware/storyValidation');

/**
 * @swagger
 * components:
 *  schemas:
 *    Story:
 *      description: A story with creative prompts and a PDF link
 * /stories:
 *  get:
 *    description: Get a list of all stories in the database
 *    summary: Returns a list of all stories from the database
 */
router.get('/', authRequired, async (req, res) => {
  try {
    const stories = await Stories.getAll();
    res.status(200).json(stories);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

/**
 * @swagger
 * components:
 *  parameters:
 *    storyId:
 *      name: ID
 *      in: path
 *      description: The unique ID of a story object
 *      example: 1
 *      schema:
 *        type: integer
 * /stories/{id}:
 *  get:
 *    description: Searches the database for a specific story
 *    summary: Query the database for a story with the given ID
 */
router.get('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  try {
    const story = await Stories.getById(id);
    if (story.length > 0) {
      res.status(200).json(story[0]);
    } else {
      res.status(404).json({ error: 'StoryNotFound' });
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

/**
 * @swagger
 * /story:
 *  post:
 *    description: Add a story to the database
 *    summary: Attempts to post a new story and returns the new ID on success
 */
router.post('/', authRequired, storyValidation, async (req, res) => {
  const story = req.body;
  try {
    const [ID] = await Stories.add(story);
    res.status(201).json({ ID });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

/**
 * @swagger
 * /story:
 *  put:
 *    description: Updates the story in the database with the given ID
 *    summary: Attempts to update the story with the given ID
 */
router.put('/:id', authRequired, storyUpdateValidation, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const count = await Stories.update(id, changes);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'StoryNotFound' });
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

/**
 * @swagger
 * /story:
 *  delete:
 *    description: Deletes the story in the database with the given ID
 *    summary: Attempts to delete the story with the given ID
 */
router.delete('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await Stories.remove(id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'StoryNotFound' });
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

module.exports = router;