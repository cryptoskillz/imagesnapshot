import puppeteer from "@cloudflare/puppeteer";

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const { searchParams } = new URL(request.url);
        let url = searchParams.get("url");

        let img: Buffer;
        if (url) {
            url = new URL(url).toString(); // normalize
            img = await env.SNAPSHOT.get(url, { type: "arrayBuffer" });
            if (img == null) {
            	console.dir(puppeteer)
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
                img = (await page.screenshot()) as Buffer;
                await env.SNAPSHOT.put(url, img, {
                    expirationTtl: 60 * 60 * 24,
                });
                await browser.close();
            }
            return new Response(img, {
                headers: {
                    "content-type": "image/jpeg",
                },
            });
        } else {
            return new Response(
                "Please add an ?url=https://example.com/ parameter"
            );
        }
    },
};