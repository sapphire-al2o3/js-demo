self.addEventListener('message', e => {
    let n = e.data;
    console.log(n);
    let pi = 0;
    for(let i = 0; i <= n; i++) {
        let t = i / n;
        pi += 4 / (1 + t * t);
    }

    pi /= n;
    self.postMessage(pi);
});
