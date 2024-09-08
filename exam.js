
    if(sessionStorage.getItem('user')==null){
        location.assign('register.html')
    }


const startBtn= document.querySelector('.start-btn')
const examContainer= document.querySelector('.exam-contain')
const img=document.querySelector('.starting-img-contain')
const text=document.querySelector('pre')
const examPage=document.querySelector('.exam-starting-text')
const exam=document.querySelector('#exam')
const navbar=document.querySelector('#navbar')
const perv=document.querySelector('#prev')
const next=document.querySelector('#next')
const flag=document.querySelector('#flag')
const timer=document.querySelector('.timer')
const submit=document.querySelector('.submit')
const flagSection=document.querySelector('.flaged-section')
const bullets=[]
for(let i=1;i<11;i++){
    const bullet=document.querySelector('#dot-'+i)
    bullets.push(bullet);
}
const answers=[]
const question=document.querySelector('.exam-question')
for(let i=1;i<5;i++){
    const chioce=document.querySelector('#choice-'+i)
    chioce.setAttribute('onclick','selectAnswer(this,'+i+')')
    answers.push(chioce);

}



class Exam{

    async _setQuestions() {
        const allQuestions=fetch('./question.json').then((res)=>{return res.json()}).then((data)=>{
            return data
        })
        const data=await allQuestions
        for (let i = data.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = data[i];
            data[i] = data[j];
            data[j] = temp;
        }        
        return data.slice(0,10)

    }

    async intialze(){
        const username=document.querySelector('#username')
        const user=JSON.parse(sessionStorage.getItem('user'))
        username.textContent=user.email;
        this.questions=await this._setQuestions()
        this._displayQuestion()

    }

    constructor(){
        this.start=true;
        this.finish=false;
        this.currnetQuestion=0;
        this.seconds=60*4;
        this.questions=[]
        this.chosenAnswers=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        this.flagedQuestions=[]
    }

    
    startTimer(){
        setInterval(()=>{
            this._setTimer()
        },1000)
    }
    _displayQuestion(){
        if(!bullets[this.currnetQuestion].classList.contains('dot-currnet'))
            bullets[this.currnetQuestion].classList.add('dot-currnet')
        for(let i=0;i<10;i++){
            if(i!=this.currnetQuestion){
                if(bullets[i].classList.contains('dot-currnet'))
                    bullets[i].classList.remove('dot-currnet')
            }
        }
        question.textContent='Question '+(this.currnetQuestion+1)+': '+this.questions[this.currnetQuestion].question;
        for(let i=0;i<4;i++){
            if(this.chosenAnswers==i){
                if(!answers[i].classList.contains('answer-chosen'))
                    answers[i].classList.add('answer-chosen')
            }
            else{
                if(answers[i].classList.contains('answer-chosen'))
                    answers[i].classList.remove('answer-chosen')
            }
            answers[i].textContent=this.questions[this.currnetQuestion].options[i].text
        }
        if(this.currnetQuestion!=0){
            if(perv.classList.contains('hidden'))
                perv.classList.remove('hidden')
        }
        else{
            
            if(!perv.classList.contains('hidden')){
                perv.classList.add('hidden')

            }
        }
        if(this.currnetQuestion!=9){
            if(next.classList.contains('hidden'))
                next.classList.remove('hidden')
        }
        else{
            if(!next.classList.contains('hidden'))
                next.classList.add('hidden')
        }
        if(this.chosenAnswers[this.currnetQuestion]!=-1){
            for(let i=0;i<4;i++){
                if(answers[i].classList.contains('answer-chosen'))
                    answers[i].classList.remove('answer-chosen')
            }
            if(!answers[this.chosenAnswers[this.currnetQuestion]].classList.contains('answer-chosen'))
                answers[this.chosenAnswers[this.currnetQuestion]].classList.add('answer-chosen')
            
        }
    }
    selectAnswer(i){
        this.chosenAnswers[this.currnetQuestion]=i

        this.moveForwrad()
    }
    moveForwrad(){
        this._displayQuestion()
        if(this.currnetQuestion<9){
            this.currnetQuestion++
            this._displayQuestion()

            
        }

    }
    moveBackward(){
        this._displayQuestion()
        if(this.currnetQuestion>0){
            this.currnetQuestion--
            this._displayQuestion()

        }
    }

    _setTimer(){
        if(this.seconds==0){
            location.assign('/timeout.html')
        }
        let min=parseInt(this.seconds/60)
        let sec=this.seconds%60;
        if(sec<10){
            sec='0'+sec
        }

        timer.textContent='0'+min+':'+sec;
        this.seconds--


    }

    setFlaged(){
        if(!(this.flagedQuestions.length>0 &&this.flagedQuestions.findIndex((v)=>v==this.currnetQuestion)!=-1)){
            const flaged=document.createElement('div')
            flaged.classList.add('flaged-question')
            flaged.textContent='Question '+(this.currnetQuestion+1);
            this.flagedQuestions.push(this.currnetQuestion)
            flaged.setAttribute('onclick','getFlaged(event,'+this.currnetQuestion+')')
            flagSection.appendChild(flaged)
        }
    }

    getFlaged(i){
        this.flagedQuestions=this.flagedQuestions.filter((v,index)=>{
            if(v!=i){
                return v
            }
        })
        this.currnetQuestion=i
        this._displayQuestion()
    }

    _getScore(){
        let score=0
        for(let i=0;i<10;i++){
            if(this.chosenAnswers[i]!=-1)
                console.log(this.questions[i].answer);
                console.log(this.questions[i].options[this.chosenAnswers[i]].option);
                
                if(this.questions[i].answer==this.questions[i].options[this.chosenAnswers[i]].option){
                    score++
                }
        }
        return score
    }

    submit(){
        const score=this._getScore()
        if(score==10){
            location.assign('fullmark.html')
        }
        else{
            sessionStorage.setItem('score',score)
            location.assign('score.html')
        }
    }

}

const ex=new Exam();
ex.intialze();
function selectAnswer(e,i){
    ex.selectAnswer(i-1)
    e.target
}

next.addEventListener('click',()=>{
    ex.moveForwrad()
})

perv.addEventListener('click',()=>{
    ex.moveBackward()
})

flag.addEventListener('click',()=>{
    ex.setFlaged()
})

submit.addEventListener('click',()=>{
    ex.submit()
})

function getFlaged(event,i){
    event.target.remove()
    ex.getFlaged(i)
}



startBtn.addEventListener('click',(e)=>{
    img.classList.add('opacity')
    text.classList.add('hidden')
    img.classList.add('hidden-text')
    examPage.classList.add('exam-width')
    navbar.classList.remove('hidden')
    navbar.classList.add('navbar-hidden')
    setTimeout(()=>{
        bullets[0].classList.add('dot-currnet')
        navbar.classList.add('navbar')
        img.classList.add('hidden')
        exam.classList.remove('hidden')
        exam.classList.add('exam')
        ex.startTimer()
    },2000)
    examContainer.classList.add('button-transtion-height')
    e.target.remove()


})