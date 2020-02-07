
voteintelligence = {
    findWinner: function(votes) {
        let placeVotes = new Map();

        let places = [];

        votes.forEach(vote => {
            if (places.indexOf(vote.place.toString()) < 0) {
                console.log("Adding " , vote.place.toString());
                console.log("Index " , places.indexOf(vote.place.toString()));
                places.push(vote.place.toString());
            }
        });

        console.log('Places ', places);
        
        places.forEach(p => {
            placeVotes.set(p, 0);
        });
        
        votes.forEach(v => {
            placeVotes.set(v.place.toString(), placeVotes.get(v.place.toString())+1);
        })
        
        console.log('votes counted', placeVotes);

        let mostId;
        let most = -1;

        placeVotes.forEach((v, k)=> {
            if (v > most) {
                most = v;
                mostId = k;
            }
        });

        console.log("WINNER ID", mostId);
        
        return mostId;
    }
}

module.exports = voteintelligence;