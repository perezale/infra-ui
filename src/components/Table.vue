<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key Name
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="instance in instances" :key="instance.instanceId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img :src="instance.icon" :class="instance.instanceType.includes('f1') ? 'bg-gray-800' : ''" class="h-10 w-10 rounded-full " alt="">
                      <!-- <img  v-if="instance.name.toLowerCase().includes('fpga')" 
                          class="h-10 w-10 rounded-full bg-gray-800" 
                          src="https://www.ibv-augsburg.de/wp-content/uploads/2020/08/ibv_icon_firmwareentwicklung-fpga_01weiss.png" alt="" /> 
                      <img  v-if="instance.name.toLowerCase().includes('gpu')" 
                          class="h-10 w-10 rounded-full" 
                          src="https://www.flaticon.es/svg/vstatic/svg/1088/1088744.svg?token=exp=1619653535~hmac=6de174fa15f3971bc5c38435f2df4c2b" alt="" /> 
                      <img  v-if="instance.name.toLowerCase().includes('cpu')" 
                          class="h-10 w-10 rounded-full" 
                          src="https://cdn.icon-icons.com/icons2/1603/PNG/512/microchip-processor-chip-cpu_108630.png" alt="" />  -->
                      <!-- <img class="h-10 w-10 rounded-full" :src="person.image" alt="" /> -->
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ instance.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ instance.instanceId }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ instance.instanceType }}</div>
                  <div class="text-sm text-gray-500">{{ instance.publicIp }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="instance.status.Code == 80" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Stopped
                  </span>
                  <span v-if="instance.status.Code == 16" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Runnning
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ instance.keyName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <InstanceOptionsMenu :instance="instance" >

                  </InstanceOptionsMenu>
                  <!-- <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const people = [
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]
const instanceTypes = [
  {
    "type": "fpga",
    "awsTypes": ["f1"],
    "icon": "https://www.ibv-augsburg.de/wp-content/uploads/2020/08/ibv_icon_firmwareentwicklung-fpga_01weiss.png"
  },
  {
    "type": "gpu",
    "awsTypes": ["g4dn", "p2", "p3"],
    "icon": "https://www.flaticon.es/svg/vstatic/svg/1088/1088744.svg?token=exp=1619653535~hmac=6de174fa15f3971bc5c38435f2df4c2b"
  },
  {
    "type": "cpu",
    "awsTypes": ["t3", "t3a", "c5", "c5n"],
    "icon": "https://cdn.icon-icons.com/icons2/1603/PNG/512/microchip-processor-chip-cpu_108630.png"
  },
];
import axios from 'axios';

import InstanceOptionsMenu from './InstanceOptionsMenu.vue';

export class InstanceDetailDto {
  name;
  instanceId;
  instanceType;
  status;
  publicIp;
}

export default {
  name: 'Table',
  components: {
    InstanceOptionsMenu,
  },
  data() {
    return {
      instances: []
    }
  },
  setup() {
    return {
      people,
      instanceTypes,
    }
  },
  mounted() {
    this.fetchInstances();
  },
  methods: {
    async fetchInstances(){
      let _self = this;
      axios.get("http://localhost:3000/ec2/instances/").then(res => {
        const data = res.data.map(entry =>  {
          return {
            ...entry,
            icon: _self.icon(entry.instanceType)
          }
        });
        console.log(data)
        _self.instances = data;
      });
    },
    icon(instanceTypeName){
      let instanceType = instanceTypeName.split('.')[0];
      return this.instanceTypes.find((item) => item.awsTypes.includes(instanceType))?.icon;
    } 
  }
  
}
</script>