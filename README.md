## competitive sketching

have you seen [r/place](https://www.reddit.com/r/place/)? we're making that, but for less than however many million people use reddit.

### Is this for me?

no.

### What's this for though?

fun

### How's it work?

#### game design stuff

Hi sam! I dont think anyone else is looking so I'll talk straight to you.

I've been thinking about what you said about redesigning the game. Picking pixels one at a time isn't going to work with so few artists (cough cough)

drawing lines is a good start, letting people make bigger changes at once.
taking that a step farther and drawing with implicit equations would add some fun dynamics, but is too hard to implement.
what's most important is that doodlers can add more to the page when they want to.

how about taking a stamina bar from games? you have n pixels you can place and receive a new one every minute up to maybe 16 (a 4x4 block can be recognized as something)

#### the engineering of it all

So this is behind a proxy and I'm not thinking about https

I want to minimize the logic on the client, but it has quite a lot going on.
People go to the website and can view the canvas.
if updated while viewing, update the view
    this is serversentevents
If they want to add to it, login via office then:
    swatch of black, white, primary and secondary colours and also 8 daily random colours can be chosen
    when click on point on canvas, it is given active colour
    view remaining paint

there is only 1 active URL (and extras used for auth)
no session on the server: all connections are initiated with clientside cookies

the updates are stored in an append-only log.
`[(user_id, timestamp, last_edit_here, point, new_colour)]`

the canvas is defined as an immutable function of this log:

```
applyentry entry = update (point entry) (new_colour entry)
fold applyentry canvas log
```

many operations can be accelerated as necessary on this datastructure.
the simplest is caching the canvas for direct requests