import Joi from 'joi';
export default {
	id: 'rpc',
	handler: (router, { database }) => {
		router.post('/', (req, res) => {
			console.log(req.accountability);
			if (req.accountability?.user == null) {
				res.status(403);
				return res.send(`You don't have permission to access this.`);
			}
			// Define the schema for the payload
            const schema = Joi.object({
                name: Joi.string().required(),
                parameters: Joi.object().required()
            });

            // Validate the payload against the schema
            const { error } = schema.validate(req.body);
            if (error) {
                res.status(400);
                return res.send(error.details[0].message);
            }
			
			let payload = JSON.parse(JSON.stringify(req.body));
			database.raw(`SELECT ${payload.name}('${JSON.stringify(payload.parameters)}')`)
			.then((results) => res.json(results.rows))
			.catch((error) => {
				res.status(500);
				res.send(error.message);
			});
						
		});
	},
};