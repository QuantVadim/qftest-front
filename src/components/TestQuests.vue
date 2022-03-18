<template>
<div :class="'select-mode_'+SelectMode.mode">
<div v-if="SelectMode.enable" class="select-panel wide-content-mode">
<div class="header-content main-center">
  <div>
    <span class="inline-block"><it-icon class="inline-block" name="select_all" color="white" style="font-size: 32px; margin-top: -4px" outlined /></span>
    <span class="inline-block">Выбрано: {{SelectMode.selected.length}}</span>
    <Button v-if="SelectMode.selected.length > 0" @click="toggleSelectMenu" icon="pi pi-chevron-down" class="p-button-rounded p-button-text" style="color: white;" />
      <span>
         <Menu ref="selectMenu" :model="selectMenu" :popup="true" />
      </span>
  </div>
  <div></div>
  <div>
    <Button label="Отмена" @click="SelectMode.enable = false" class="p-button-outlined" style="color: white"/>
  </div>
</div>
</div>
<draggable
  v-model="items"
  item-key="id"
  tag="transition-group"
  animation="150"
  group="questions"
  handle=".handle-card-center_draggable"
  ghost-class="blue-background-class"
  @change="UpdateList"
>
  <template #item="{ index }">
    <block :class="{'_selected-card': SelectMode.selected.includes(items[index].id) }">
    <div v-if="mode == 'editor'" class="handle-card" :class="{'handle-card-center_draggable': SelectMode.enable == false }">
      <div>
        <it-icon v-if="SelectMode.enable == false" @click="deleteCard(index)" name="delete" size="32px" />
        <p-checkbox class="__card-check-box" v-else :name="'card-check_'+items[index].id" :value="items[index].id" v-model="SelectMode.selected" />
      </div>
      <div @click="ClickHandleCard" class="handle-card-center">{{ index+1 }}</div>
      <div class="handle-part-right">
        <it-icon @click="DublicateCard(index)" name="content_copy" />
        <it-icon name="more_horiz" @click="toggle" />
        <div>
          <Menu ref="menu" :model="itemsMenu" :popup="true" />
        </div>
      </div>
    </div>
    <div class="inner-card">
    <component 
      :is="items[index].type.toLowerCase()+'Card_'+mode" 
      :data="items[index]" 
      @open-folder="OpenFolder" 
    />
    </div>
    </block>
  </template>
</draggable>
<it-divider/>
  <Block v-if="mode == 'editor'" class="_tool-bar">
    <span class="p-buttonset">
    <Button @click="addCard('Simple')" label="Текст" class="p-button-outlined" />
    <Button @click="addCard('Choice')" label="Выбор" class="p-button-outlined" />
    <Button @click="addCard('Orthoepy')" label="Ударение" class="p-button-outlined" />
    <Button v-if="isFolder != true" @click="addCard('Folder')" label="Папка" class="p-button-outlined" />
    </span>
  </Block>


</div>
</template>

<script>
import draggable from "vuedraggable";
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Block from '@/components/Block';
import Toolbar from 'primevue/toolbar';

import FolderCard_editor from "./TestCards/Folder";

//Simple
import SimpleCard_editor from "./TestCards/Editor/Simple";
import SimpleCard_basic from "./TestCards/Basic/Simple";
import SimpleCard_result from "./TestCards/Result/Simple";
//Choice
import ChoiceCard_editor from "./TestCards/Editor/Choice";
import ChoiceCard_basic from "./TestCards/Basic/Choice";
import ChoiceCard_result from "./TestCards/Result/Choice";
//Orthoepy
import OrthoepyCard_editor from "./TestCards/Editor/Orthoepy";
import OrthoepyCard_basic from "./TestCards/Basic/Orthoepy";
import OrthoepyCard_result from "./TestCards/Result/Orthoepy";

export default {
  components: {
    draggable, Menu, Button, Toolbar, Block, FolderCard_editor,
    SimpleCard_editor, SimpleCard_basic, SimpleCard_result,
    ChoiceCard_editor, ChoiceCard_basic, ChoiceCard_result,
    OrthoepyCard_editor, OrthoepyCard_basic, OrthoepyCard_result
  },
  props: ['data', 'mode', 'isFolder'],
  data() {
    return {
      items: this.data || [],

      SelectMode: {
        enable: false,
        selected: [],
        mode: '', //to-folder
      },
      itemsMenu: [
        {
					label: 'Выбрать',
					icon: 'pi pi-check-square',
					command: () => {
            this.SelectMode.enable = true;
					}
				},
      ],
      selectMenu:[],
    };
  },
  watch:{
    'SelectMode.enable'(){
        this.SelectMode.selected = [];
        this.SelectMode.mode = '';
    }
  },
  methods: {
    OpenFolder(id){
      if(this.SelectMode.enable == false){
        this.$router.push({query: {folder: id}});
      }else{
        //Нажатие на папку в режиме to-folder (Перенос карточек в папку)
        if(this.SelectMode.mode == 'to-folder' && this.SelectMode.selected.includes(id) == false){
          for (let i = 0; i < this.items.length; i++) {
            const el = this.items[i];
            if(el.id == id && el.type == "Folder"){
              let selCards = this.GetSelectedCards();
              this.items[i].body.push.apply(this.items[i].body, selCards);
              this.DeleteSelectedCards();
              this.SelectMode.enable = false;
            }
          }
        }else{
          console.log("В эту папку нельзя переместить");
        }
      }
    },
    UpdateList(){
      this.$emit('changeList', this.items);
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    toggleSelectMenu(event) {
      this.$refs.selectMenu.toggle(event);
    },
    showinfo(){
      console.log(this.items);
    },
    addCard(cardType) {
      switch (cardType) {
        case 'Simple':
        case 'Choice': 
        case 'Orthoepy':
            this.items.push({id: Math.random().toString().split('.')[1], type: cardType });
            break;
        case 'Folder':
          this.items.push({id: Math.random().toString().split('.')[1], type: cardType, name: 'Новая папка' });
          break
        default:
          break;
      }
      this.$emit('changeList', this.items);
    },
    deleteCard(index){
      this.items.splice(index, 1);
    },
    DublicateCard(index){
      let card =  JSON.parse(JSON.stringify(this.items[index]));
      if(card.type == "Folder"){ // Присваивание новых id карточкам папки
        for (let i = 0; i < card.body.length; i++) {
          card.body[i].id = Math.random().toString().split('.')[1];
        }
      }
      card.id = Math.random().toString().split('.')[1];
      this.items.splice(index+1, 0, card);
    },
    ClickHandleCard(event){
      if(this.SelectMode.enable){
        let handleCard = event.target.parentElement;
        if(handleCard.classList.contains('handle-card')){
          let checkboxCard = handleCard.querySelector(".p-checkbox input");
          checkboxCard.click();
        }
      }
    },
    GetSelectedCards(){//Получает выбранные карточки (из папок изымаются карточки)
      let items = this.items.filter(item => this.SelectMode.selected.includes(item.id));
      let cards = [];
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
          if(el.type != "Folder"){
            cards.push(el);
          }else{
            let sBody = el.body;
            for (let j = 0; j < sBody.length; j++) {
              cards.push(sBody[j]);
           }
          }
      }
      return cards;
    },
    GetSelectedItems(){//Получает выбранные карточки (папки берутся как элемент)
      let items = this.items.filter(item => this.SelectMode.selected.includes(item.id));
      let cards = [];
      for (let i = 0; i < items.length; i++) {
        cards.push(items[i]);
      }
      return cards;
    },
    DeleteSelectedCards(){
      for (let i = this.items.length-1; i >= 0; i--) {
        const el = this.items[i];
        if(this.SelectMode.selected.includes(el.id)){
          this.items.splice(i, 1);
        }
      }
    }
  },
  mounted(){
    if(this.isFolder){
      this.selectMenu = [
        {
          label: 'Убрать из папки',
					icon: 'pi pi-reply',
					command: () => {
            
					}
        }
      ];
    }else{
      this.selectMenu = [
        {
          label: 'Поместить в папку',
					icon: 'pi pi-folder-open',
					command: () => {
            this.SelectMode.mode = "to-folder";
					}
        }
      ];
    }
  }
};
</script>

<style>
.select-mode_to-folder .inner-card .folder-content .part-1{
  opacity: 1;
  animation: scale-pulse 1s infinite;
}
.select-mode_to-folder ._selected-card .inner-card .folder-content .part-1{
  opacity: 0.5;
  animation: none;
}
</style>

<style scoped>


.handle-card .__card-check-box{
  margin-left: 8px;
  margin-top: 5px;
  margin-right: 10px;
}

.select-panel{
  width: 100%;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  height: 42px;
  line-height: 40px;
  background-color: #385894;
}

.select-panel .inline-block{
  vertical-align: middle;
  font-size: 20px;
  color: rgb(197, 197, 197);
}

.handle-card-center{
  line-height: 28px;
  color: rgb(206, 206, 206);
}
.handle-part-right .it-icon {
  padding-right: 8px;
}
.btn-add-card {
  line-height: 18px;
  font-size: 18px;
}
.btn-add-card .it-icon {
  line-height: 23px;
  font-size: 26px;
}
.handle-card .it-icon {
  padding-left: 3px;
  padding-right: 3px;
  font-size: 24px;
  line-height: 30px;
  opacity: 0.5;
}
.inner-card {
  padding: 10px;
}
.block {
  padding: 0px;
  overflow: hidden;
}
.block._tool-bar{
  padding: 8px;
}
.handle-card .it-icon{
  cursor: pointer;
}
.handle-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  background-color: rgb(236, 236, 236);
  height: 30px;
}
.handle-card:hover {
  background-color: #b6cbf1;
  height: 30px;
  
}
.handle-card-center_draggable{
  cursor: move;
}
.blue-background-class .handle-card {
  opacity: 0.4;
}
.blue-background-class {
  background-color: #5589ec;
}
</style>