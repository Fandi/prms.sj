prms.js
=======

crappy attempt to implement [C# async/await](http://msdn.microsoft.com/en-us/library/vstudio/hh873191.aspx) using Javascript (or is it JavaScript?)

not to be confused with [CommonJS Promises](http://wiki.commonjs.org/wiki/Promises/A), the purpose of prms.js is not to chain the asynchronous processes, instead prms.js signals the next process to proceed if it doesnt consume the result of the previous asynchroonus process.

John: Bob, could you repair my television?

Bob: sure thing, but I need a wrench for that, and I don't bring me any wrench at the moment.

John: I'll get you one, in the mean time, could you mop the floor? I see you bring a mop there.

Bob: *sigh* all right.
