const knex = require("../db/connection");
const lodash = require("lodash")

function addCritic(data) {
    if (data) {
      let formattedData;
  
      if (Array.isArray(data)) {
        formattedData = data.map((review) => {
          return Object.entries(review).reduce((accumulator, [key, value]) => {
            return lodash.set(accumulator, key, value);
          }, {});
        });
      } else {
        formattedData = Object.entries(data).reduce((accumulator, [key, value]) => {
          return lodash.set(accumulator, key, value);
        }, {});
      }
  
      return formattedData;
    }
  
    return data;
  }

function list() {
    return knex("movies").select("*");
}

function listShowing() {
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where("mt.is_showing", true)
    .distinct("m.movie_id")
}

function read(movie_id) {
    return knex("movies as m")
    .select("*")
    .where({"m.movie_id": movie_id })
    .first()
}

function readMovieTheaters(movie_id) {
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "m.movie_id")
    .where({"m.movie_id": movie_id, "mt.is_showing": true})
}

function readMovieReviews(movie_id) {
    return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({ "r.movie_id": movie_id })
    .select(
      "r.*",
      "c.critic_id as critic.critic_id",
      "c.preferred_name as critic.preferred_name",
      "c.surname as critic.surname",
      "c.organization_name as critic.organization_name"
    )
    .then(addCritic);
}

module.exports = {
    list,
    listShowing,
    read,
    readMovieTheaters,
    readMovieReviews,
}