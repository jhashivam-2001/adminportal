import { query } from "../../../lib/db";

const handler = async (req, res) => {
	const { type } = req.query;

	try {
		let results;
		const now = new Date().getTime();
		if (type === "all") {
			results = await query(
				`
      SELECT * from news
    `
			);
		} else if (type == "active") {
			results = await query(`
        SELECT * from news where openDate<${now} and closeDate>${now};
        `);
		} else if (type == "range") {
			const start = req.body.start_date;
			const end = req.body.end_date;

			results = await query(`
			SELECT * from news where closeDate<=${end} and openDate>=${start}`).catch(
				(err) => console.log(err)
			);
		}
		let array = JSON.parse(JSON.stringify(results));
		array.forEach((element) => {
			element.image = JSON.parse(element.image);
		});
		array.forEach((element) => {
			element.attachments = JSON.parse(element.attachments);
		});

		// console.log(array);
		return res.json(array.reverse());
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

export default handler;
