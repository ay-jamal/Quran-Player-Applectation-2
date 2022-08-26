let audio = document.querySelector(".quranPlayer");
let soarhContainer = document.querySelector(".surah");
let ayah = document.querySelector(".ayah");

let next = document.querySelector(".next");
let play = document.querySelector(".play");
let prev = document.querySelector(".prev");

getSurah();
function getSurah() {
  fetch("https://quran-endpoint.vercel.app/quran")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < 114; i++) {
        soarhContainer.innerHTML += `
          <div>
           <p>${data.data[i]?.asma.ar.long}</p>
           <p>${data.data[i]?.asma.en.long}</p>
           <p>عدد  الآيات :  ${data.data[i]?.ayahCount} , <span>مكان النزول :  ${data.data[i]?.type.ar} </span> </p>
           
           
           </div>  

        
        `;
      }

      let allSurahs = document.querySelectorAll(".surah > div");
      let ayahAudio;
      let ayahText;
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          fetch(`https://quran-endpoint.vercel.app/quran/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              let verbes = data.data.ayahs;
              console.log(verbes);
              ayahAudio = [];
              ayahText = [];

              verbes.forEach((verb) => {
                ayahAudio.push(verb.audio.url);
                ayahText.push(verb.text.ar);
              });
              let ayahIndex = 0;
              changeAyah(ayahIndex);
              audio.addEventListener("ended", () => {
                ayahIndex++;
                if (ayahIndex < ayahAudio.length) {
                  changeAyah(ayahIndex);
                } else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                  audio.pause();
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "السَّوْرَة اكتملت",
                    showConfirmButton: false,
                    timer: 1550,
                  });
                }
              });
              next.addEventListener("click", () => {
                ayahIndex < ayahAudio.length - 1 ? ayahIndex++ : ayahIndex == 0;
                changeAyah(ayahIndex);
              });
              prev.addEventListener("click", () => {
                ayahIndex == 0
                  ? ayahIndex == ayahAudio.length - 1
                  : ayahIndex--;

                changeAyah(ayahIndex);
              });
              //start button handel
              let isPlaying = false;
              tooglePlay();

              function tooglePlay() {
                if (isPlaying) {
                  audio.pause();
                  play.innerHTML = `<i class="fas fa-play"></i>`;
                  isPlaying = false;
                } else {
                  audio.play();
                  play.innerHTML = `<i class="fas fa-pause"></i>`;
                  isPlaying = true;
                }
              }
              play.addEventListener("click", tooglePlay);

              function changeAyah(index) {
                audio.src = ayahAudio[index];
                ayah.innerHTML = ayahText[index];
              }
            });
        });
      });
    });
}
