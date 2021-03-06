import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookingValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public refs = schema.refs({
		venueId: this.ctx.params.id
	})

	public schema = schema.create({
		title: schema.string(),
		field_id : schema.number([
			rules.exists({
				table: 'fields',
				column: 'id',
				where: { venue_id: this.refs.venueId }
			})
		]),
		play_date_start: schema.date({
			format: 'yyyy-MM-dd HH:mm:ss',
		}, [
			rules.after('today')
		]),
		play_date_end: schema.date({
			format: 'yyyy-MM-dd HH:mm:ss',
		}, [
			rules.after('today')
		])
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages = {
		'required': 'the {{field}} is required to create new booking',
		'datetime.after': 'the {{field}} must be filled with a date after today',
		'field_id.exists': 'the {{field}} may not exists or doesn\'t match with venue_id'
	}
}
