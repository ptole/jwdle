function scrape(){
    const results = [];
    const ul = document.querySelector('[data-testid="product-cards-container"]');
    const lis = ul.querySelectorAll('.list-none');
    for (const li of lis) {
        const o = {};

        const img = li.querySelector('img');
        var imgpath = "https://www.warhammer.com";
        imgpath += img.getAttribute('src').split('?')[0];
        o.src = imgpath;

        const price = li.querySelector('#currentPriceText');
        o.cost = price.textContent.substring(1);

        const name = li.querySelector('#link');
        o.name = name.ariaLabel;
        results.push(o);
    }

    const jsonString = JSON.stringify(results, null, 2);
    console.log(jsonString);
}