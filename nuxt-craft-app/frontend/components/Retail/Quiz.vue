<script setup>
const props = defineProps({
    subHeading: {
        type: String,
        default: ''
    },
    subHeading2: {
        type: String,
        default: ''
    },
    copy: {
        type: String,
        default: ''
    },
    buttonCaption: {
        type: String,
        default: ''
    },
    information: {
        type: String,
        default: ''
    },
    information2: {
        type: String,
        default: ''
    },
    subHeading3: {
        type: String,
        default: ''
    },
    subHeading4: {
        type: String,
        default: ''
    },
    copy2: {
        type: String,
        default: ''
    },
    buttonCaption2: {
        type: String,
        default: ''
    },
    buttonLink: {
        type: String,
        default: ''
    },
    quizEntries: {
        type: Array,
        default: () => []
    }
})
</script>
<template>
            <section class="section">
                <div class="container">

                    <section class="section quiz card">
                        <form id="quiz-form" name="quiz-form" action="#" method="post">
                            <div class="quiz__intro">
                                <h3>{{ subHeading }}</h3>
                                <h4>{{ subHeading2 }}</h4>
                                <p>{{ copy }}</p>
                                <button class="button button--primary js-quiz-start" type="button">{{ buttonCaption }}</button>
                                <div class="question-info"><b>{{ information }}</b>
                                    <p>{{ information2 }}</p>
                                </div>
                            </div>
                            <ul class="quiz__question-wrap">
                                <li class="quiz__question" v-for="(item, index) in quizEntries" :key="item.id">
                                    <div class="container">
                                        <div class="quiz__question-form">
                                            <h3>{{ subHeading3 }}</h3>
                                            <h4>{{ item.title }}</h4>
                                            <div class="quiz__controls">
                                                <div class="form-group">
                                                    <label class="radio">
                                                        <input class="radio-input" type="radio" :name="`radio${index + 1}`" value="value1" checked="checked" /><span class="radio-box">
                                                            <NuxtImg
                                                                v-if="item.image?.[0]?.url" 
                                                                :src="item.image[0].url" 
                                                                :alt="item.image[0].alt || item.firstOption"
                                                                loading="lazy"
                                                                class="radio-image"
                                                            />
                                                            <span class="radio-box__label">{{ item.firstOption }}</span>
                                                        </span>
                                                    </label>
                                                </div>
                                                <div class="form-group">
                                                    <label class="radio">
                                                        <input class="radio-input" type="radio" :name="`radio${index + 1}`" value="value2" checked="" /><span class="radio-box">
                                                            <NuxtImg
                                                                v-if="item.image2?.[0]?.url" 
                                                                :src="item.image2[0].url" 
                                                                :alt="item.image2[0].alt || item.secondOption"
                                                                loading="lazy"
                                                                class="radio-image"
                                                            />
                                                            <span class="radio-box__label">{{ item.secondOption }}</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="quiz__buttons">
                                                <button class="button button--primary text-right icon-left quiz__prev" type="button" v-if="index > 0">Previous</button>
                                                <button class="button button--primary quiz__next" type="button" v-if="index < quizEntries.length - 1">Next</button>
                                                <button class="button button--primary quiz__submit" type="submit" v-if="index === quizEntries.length - 1">Submit</button>
                                            </div>
                                            <div class="question-info"><b>{{ information }}</b>
                                                <p>{{ information2 }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </form>
                        <div class="quiz__result">
                            <div class="container">
                                <div class="text-center">
                                    <h3 class="h3 text-primary">{{ subHeading4 }}</h3>
                                    <p>{{ copy2 }}</p>
                                </div>
                                <div class="quiz__result-actions">
                                    <NuxtLink
                                            class="button button--primary" 
                                            :to="buttonLink.startsWith('/') ? buttonLink : `/${buttonLink}`">
                                            {{ buttonCaption2 }}
                                    </NuxtLink>
                                </div>
                                <div class="question-info"><b>{{ information }}</b>
                                    <p>{{ information2 }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="quiz__progress">
                            <div class="container">
                                <div class="progress">
                                    <div class="progress__questions">&nbsp;<span class="progress__questions-current"></span>&nbsp;of&nbsp;<span class="progress__questions-total"></span></div>
                                    <progress class="progress__line" value="10" max="100"></progress>
                                    <div class="progress__dividers"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
</template>
