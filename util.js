export function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchData() {

  const url = 'https://irish-apis.netlify.app/weather/api';

  
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
	
			body: JSON.stringify({
				query: `
				{
					dailyData(station: ATHENRY) {
						date
						rain
						hm
					}
				}
				`,
			}),
		});
		const ans = await res.json();
	
		const split = ans.data.dailyData.reduce(
			(acc, cur) => {
				if (cur.rain > 0) {
					acc.wet.push(cur);
				} else {
					acc.dry.push(cur);
				}
				return acc;
			},
			{ wet: [], dry: [] }
		);
	
		const wet = shuffleArray(split.wet);
		const dry = shuffleArray(split.dry);
		const winnableData = dry.slice(0, 500).concat(wet.slice(0, 100));
		const theAns = shuffleArray(winnableData);

		return theAns;
		
	} 
