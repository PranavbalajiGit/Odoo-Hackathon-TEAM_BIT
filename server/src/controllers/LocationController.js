const { Location } = require('../models');
const { z } = require('zod');

const locationSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1),
});

class LocationController {
  static async update(req, res) {
    try {
      const data = locationSchema.partial().parse(req.body);
      const location = await Location.findByPk(req.params.id);
      if (!location) return res.status(404).json({ error: 'Location not found' });

      await location.update({
        ...data,
        updatedById: req.user.id,
      });
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const location = await Location.findByPk(req.params.id);
      if (!location) return res.status(404).json({ error: 'Location not found' });

      await location.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocationController;