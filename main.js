
export function main(dtoIn) {
    //Generujeme seznam zaměstnanců
    const employees = generateEmployeeData(dtoIn);

    //Získáme všechny potřebné statistiky z generovaného seznamu
    const stats = getEmployeeStatistics(employees);

    //Vracíme objekt dtoOut se statistikami a seřazeným seznamem
    return stats;
}

// Funkce pro generování seznamu zaměstnanců 
export function generateEmployeeData(dtoIn) {
    const maleNames = ["Jan","Petr","Josef","Václav","Tomáš","Martin","Jiří","Michal","Lukáš","David","Ondřej","Roman","Marek","Daniel","Filip","Jaroslav","Stanislav","Viktor","Radek","Rudolf","Vratislav","Milan","Karel","Pavel","Lubomír","Aleš","Tom","Vladimír","Igor","Rostislav","Štěpán","Dominik","Radim","Richard","Emil","Bohumil","Miroslav","Eduard","Antonín","Patrik","Zdeněk","Jindřich","Břetislav","Libor","Vít","Dalibor","Oto","Vlastimil","Ctirad"];
    const femaleNames = ["Jana","Marie","Eva","Anna","Lucie","Petra","Alena","Ivana","Lenka","Markéta","Kristýna","Veronika","Monika","Simona","Hana","Barbora","Martina","Dana","Karolína","Jitka","Jiřina","Zuzana","Tereza","Gabriela","Nikola","Renata","Radka","Klára","Věra","Milada","Marcela","Helena","Soňa","Iveta","Blanka","Ludmila","Alžběta","Vendula","Dominika","Adéla","Naděžda","Svatava","Libuše","Milena","Kamila","Ela","Bohumila","Šárka","Růžena"];
    const surnames = ["Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec","Pokorný","Hruška","Král","Růžička","Fiala","Beneš","Urban","Kolář","Sedláček","Mach","Holub","Šimek","Kratochvíl","Bartoš","Vacek","Hájek","Kříž","Vondráček","Kopecký","Štěpánek","Mašek","Bláha","Čech","Švec","Koudelka","Štursa","Jelínek","Šafář","Pavlíček","Krejčí","Bureš","Králík","Tomášek","Volf","Štich","Zeman","Rybář","Sedlák","Kolman"];
    const workloads = [10, 20, 30, 40];

    const dtoOut = [];
    const birthdatesSet = new Set();
    const now = new Date();

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Funkce pro generování data narození
    function generateUniqueBirthdate(minAge, maxAge) {
        let birthdate;
        let attempts = 0;
        do {
            const minTime = now.getTime() - maxAge * 365.25 * 24 * 60 * 60 * 1000;
            const maxTime = now.getTime() - minAge * 365.25 * 24 * 60 * 60 * 1000;
            const time = randomInt(minTime, maxTime);
            birthdate = new Date(time).toISOString();
            attempts++;
            if (attempts > 1000) break; 
        } while (birthdatesSet.has(birthdate));
        birthdatesSet.add(birthdate);
        return birthdate;
    }

    for (let i = 0; i < dtoIn.count; i++) {
        const gender = Math.random() < 0.5 ? "male" : "female";
        const name = gender === "male"
            ? maleNames[randomInt(0, maleNames.length - 1)]
            : femaleNames[randomInt(0, femaleNames.length - 1)];
        const surname = surnames[randomInt(0, surnames.length - 1)];
        const workload = workloads[randomInt(0, workloads.length - 1)];
        const birthdate = generateUniqueBirthdate(dtoIn.age.min, dtoIn.age.max);

        dtoOut.push({ gender, name, surname, workload, birthdate });
    }

    return dtoOut;
}

// Funkce pro výpočet statistik zaměstnanců
export function getEmployeeStatistics(employees) {
    const now = new Date();

    // Pomocná funkce pro výpočet věku z data narození
    function calculateAge(birthdate) {
        const birth = new Date(birthdate);
        const age = (now - birth) / (1000 * 60 * 60 * 24 * 365.25); // věk v letech
        return age;
    }

    // Pomocná funkce pro výpočet mediánu z pole čísel
    function median(arr) {
        const sorted = [...arr].sort((a,b) => a-b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return Math.round((sorted[mid-1] + sorted[mid]) / 2);
        } else {
            return Math.round(sorted[mid]);
        }
    }

    const ages = employees.map(e => calculateAge(e.birthdate));
    const workloads = employees.map(e => e.workload);
    const womenWorkloads = employees.filter(e => e.gender === "female").map(e => e.workload);

    // Sestavení objektu statistiky
    const dtoOut = {
        total: employees.length,
        workload10: employees.filter(e => e.workload === 10).length,
        workload20: employees.filter(e => e.workload === 20).length,
        workload30: employees.filter(e => e.workload === 30).length,
        workload40: employees.filter(e => e.workload === 40).length,
        averageAge: Math.round((ages.reduce((a,b) => a+b, 0)/ages.length)*10)/10,
        minAge: Math.round(Math.min(...ages)),
        maxAge: Math.round(Math.max(...ages)),
        medianAge: median(ages),
        medianWorkload: median(workloads),
        averageWomenWorkload: womenWorkloads.length > 0 
            ? Math.round((womenWorkloads.reduce((a,b)=>a+b,0)/womenWorkloads.length)*10)/10
            : 0,
        sortedByWorkload: [...employees].sort((a,b) => a.workload - b.workload)
    };

    return dtoOut;
}
