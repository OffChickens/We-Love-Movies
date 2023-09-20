const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const movie = await service.read(req.params.movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    next({status: 404, message: `Movie cannot be found.`})
}

async function list(req, res) {
    const isShowing = req.query.is_showing;

    if (isShowing === "true") {
        const data = await service.listShowing();
        res.json({data});
    } else {
        const data = await service.list();
        res.json({data});
    }
}

async function read(req, res) {
    const isTheatersRoute = req.path.endsWith('/theaters');
    const isReviewsRoute = req.path.endsWith('/reviews');

    if(isTheatersRoute) {
        const data = await service.readMovieTheaters(res.locals.movie.movie_id);
        res.json({data})
    } else if (isReviewsRoute) {
        const data = await service.readMovieReviews(res.locals.movie.movie_id);
        res.json({data})
    } else {
        const {movie: data} = res.locals;
        res.json({data})
    }
}


module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    
}