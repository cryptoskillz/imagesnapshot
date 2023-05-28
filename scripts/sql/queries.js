
SELECT * FROM property
SELECT * FROM rental_agrement
SELECT * FROM rental_agrement
SELECT * FROM rental_cost
SELECT * FROM rental_payment
SELECT * FROM property_owner
SELECT * FROM property_distribution


#get the property
SELECT property.name as property_name,rental_agreement.name rental_name from property LEFT JOIN rental_agreement ON rental_agreement.id = property.rentalId

