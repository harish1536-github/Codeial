module.exports.setFlash=function(req, res ,next)
{
    //find out the flash ansd set it up at the response of locals
    //we access locals at template
    //In the locals we set the flash message
    res.locals.flash = {
        'success':req.flash('success'),
        'error':req.flash('error')
    }
    next();
}
