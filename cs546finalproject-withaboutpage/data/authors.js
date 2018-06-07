module.exports = {

	async createAuthors(name, CWID, email, work) {
		let authors = {
				[
				{name : "Tim Swierad", CWID : "10420920", email : "tswierad@stevens.edu", work : "Base project structure, Database seed, Page to log activities"},
				{name : "Wei Chan", CWID : "10432881", email : "wchen29@stevens.edu", work : "Frontend/Backend login and register, Database functions"},
				{name : "Bruno Rebaza", CWID : "10409453", email : "brebaza@stevens.edu", work : "Frontend homepage"},	
				{name : "Yue Lei", CWID : "10431545", email : "ylei13@stevens.edu", work : "About page"},
				{name : "Justin Miller", CWID : "10385517", email : "jmiller5@stevens.edu", work : "Custom activities"},
				]
		};
		return authors;
	};
};


module.exports = exportedMethods;