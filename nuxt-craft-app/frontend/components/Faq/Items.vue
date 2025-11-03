
<script setup>
const props = defineProps({
    subTitle: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    copy: {
        type: String,
        default: ''
    },
    qands: {
        type: Array,
        default: () => []
    }
    
})

</script>
<template>
                <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 v-if="subTitle">{{ subTitle }}</h2>
                        <h3 v-if="caption">{{ caption }}</h3>
                        <p v-if="copy">{{ copy }}</p>
                    </div>
                    <div class="tabs" data-tabs="tabs">
                        <button 
                            v-for="(item, index) in qands" 
                            :key="item.id" 
                            class="button" 
                            :data-tab="'tab' + (index + 1)" 
                            :class="{'is-active': index === 0}" 
                        >
                            {{ item.title }}
                        </button>
                    </div>
                    <div class="tab-content" data-tabs-content="tabs">
                        <div 
                        v-for="(item, index) in qands" 
                        :key="item.id" 
                        class="tab-slide" 
                        :data-tab-content="'tab' + (index + 1)" 
                        :class="{'is-active': index === 0}" 
                    >
                        <template v-if="item.items && item.items.length > 0">
                            <div class="tab-slide-wrapper">
                                <div class="tab-slide__top">
                                    <div 
                                        v-for="(card, cardIndex) in item.items.slice(0, Math.ceil(item.items.length / 2))" 
                                        :key="cardIndex" 
                                        class="card"
                                    >
                                        <h3>{{ card.title }}</h3>
                                        <h4>{{ card.subTitle }}</h4>
                                        <p>{{ card.copy }}</p>

                                        <form class="tab-slide__form" action="" method="post" v-if="card.showEnquiryForm">
                                            <input class="input" type="text" name="first-name" placeholder="First Name" id="tab-slide-first-name">
                                            <input class="input" type="text" name="last-name" placeholder="Last Name" id="tab-slide-second-name">
                                            <input class="input" type="email" name="mail" placeholder="Email adress" id="tab-slide-mail">
                                            <textarea class="input" type="textarea" name="comment" placeholder="Write your question(s) here" rows="6" id="tab-slide-areatext"></textarea>
                                            <div class="tab-slide__checkboxes">
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" />
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I acknowledge and give permission for my data to be held by Dreams and WeLove9am in accordance with the General Data Protection Regulation</span></div>
                                                </label>
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" />
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I have read and agree to the privacy policy</span></div>
                                                </label>
                                            </div>
                                            <input class="button button--primary" type="submit" value="Submit">
                                        </form>


                                    </div>
                                </div>

                                <div class="tab-slide__bottom">
                                    <div 
                                        v-for="(card, cardIndex) in item.items.slice(Math.ceil(item.items.length / 2))" 
                                        :key="cardIndex + item.items.length" 
                                        class="card"
                                    >
                                        <h3>{{ card.title }}</h3>
                                        <h4>{{ card.subTitle }}</h4>
                                        <p>{{ card.copy }}</p>

                                        <form class="tab-slide__form" action="" method="post" v-if="card.showEnquiryForm">
                                            <input class="input" type="text" name="first-name" placeholder="First Name" id="tab-slide-first-name">
                                            <input class="input" type="text" name="last-name" placeholder="Last Name" id="tab-slide-second-name">
                                            <input class="input" type="email" name="mail" placeholder="Email adress" id="tab-slide-mail">
                                            <textarea class="input" type="textarea" name="comment" placeholder="Write your question(s) here" rows="6" id="tab-slide-areatext"></textarea>
                                            <div class="tab-slide__checkboxes">
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" />
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I acknowledge and give permission for my data to be held by Dreams and WeLove9am in accordance with the General Data Protection Regulation</span></div>
                                                </label>
                                                <label class="checkbox">
                                                    <input class="checkbox-input" type="checkbox" name="checkbox" />
                                                    <div class="checkbox-box"><span class="checkbox-box__label">I have read and agree to the privacy policy</span></div>
                                                </label>
                                            </div>
                                            <input class="button button--primary" type="submit" value="Submit">
                                        </form>
                                        
                                    </div>
                                </div>
                            </div>
                        </template>
                        
                        <div v-else>No content available.</div>
                    </div>
                    </div>
                </div>
            </section>

</template>