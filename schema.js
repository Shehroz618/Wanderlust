const Joi = require('joi');

module.exports.listSchema = Joi.object({
    List: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().allow("", null)
        }).required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().required()
    }).required()
})