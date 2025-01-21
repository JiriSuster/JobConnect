<template>
  <v-container class="mt-4">
    <div v-for="(job, index) in jobs" :key="index" class="mb-4">
      <v-card>
        <v-card-title>
          {{ job.title }}
        </v-card-title>
        <v-card-subtitle>
          Category: {{ job.categories.join(', ') }}
        </v-card-subtitle>
        <v-card-actions>
          <v-btn color="primary" @click="viewJobDetails(job)">
            View Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-dialog v-model="isJobDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>
          Job Details
          <v-spacer/>
        </v-card-title>
        <v-card-text>
          <div v-if="selectedJob?._id"><strong>ID:</strong> {{ selectedJob?._id }}</div>
          <div v-if="selectedJob?.title"><strong>Title:</strong> {{ selectedJob?.title }}</div>
          <div v-if="selectedJob?.customerEmail"><strong>Customer email:</strong> {{ selectedJob?.customerEmail }}</div>
          <div v-if="selectedJob?.companyEmail"><strong>Assigned company email:</strong> {{ selectedJob?.companyEmail }}</div>
          <div v-if="selectedJob?.description"><strong>Description:</strong> {{ selectedJob?.description }}</div>
          <div v-if="selectedJob?.categories"><strong>Category:</strong> {{ selectedJob?.categories.join(', ') }}</div>
          <div v-if="selectedJob?.subcategories"><strong>Subcategories:</strong> {{ selectedJob?.subcategories.join(', ') }}</div>
          <div v-if="selectedJob?.budget"><strong>Budget:</strong> ${{ selectedJob?.budget }}</div>
          <div v-if="selectedJob?.images && selectedJob.images.length">
            <strong>Images:</strong>
            <v-chip-group>
              <v-chip
                  v-for="(image, index) in selectedJob.images"
                  :key="index"
                  class="ma-1"
              >
                <v-icon left>mdi-file-image</v-icon>
                {{ image.name }}
              </v-chip>
            </v-chip-group>
          </div>

          <v-btn v-if="canBeAssigned" @click="assignJob(selectedJob?._id ?? '')">
            ASSIGN
          </v-btn>
          <v-btn v-if="canBeunAssigned" @click="unassignJob(selectedJob?._id ?? '')">
            UNASSIGN
          </v-btn>

          <div v-if="canOpenChat">
          <div class="chat-container mt-4">
            <h4>Chat</h4>
            <div class="chat-messages" v-if="chatMessages.length">
              <div v-for="(msg, index) in chatMessages" :key="index" class="chat-message">
                <strong>{{ msg.sender }}:</strong> {{ msg.message }}
              </div>
            </div>
            <div v-else>No messages yet.</div>
          </div>

          <!-- Chat Input -->
          <v-text-field
              v-model="currentMessage"
              label="Type a message..."
              @keyup.enter="sendMessage"
              class="mt-2"
          ></v-text-field>
          <v-btn color="primary" @click="sendMessage">
            Send
          </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isJobDialogOpen = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { Job } from "@/model/Job";
import { useAuth } from "@/composables/useAuth";
import config from "@/config";
import {useChatService} from "@/composables/useChatService";

const props = defineProps({
  jobs: {
    type: Array as () => Array<Job>,
    required: true,
  },
  canBeAssigned: {
    type: Boolean,
    required: false,
    default: false,
  },
  canBeunAssigned: {
    type: Boolean,
    required: false,
    default: false,
  },
  canOpenChat: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const emit = defineEmits(["refetch-jobs"]);

const isJobDialogOpen = ref(false);
const selectedJob = ref<Job | null>(null);
const auth = useAuth();
const chatService = useChatService();

const chatMessages = ref<{ sender: string; message: string }[]>([]);
const currentMessage = ref("");

const viewJobDetails = (job: Job) => {
  selectedJob.value = job;
  isJobDialogOpen.value = true;

  if (selectedJob.value?._id) {
    chatService.joinRoom(selectedJob.value._id);
    chatService.onMessage((data) => {
      if(chatService.getClientId() == data.sender) {
        data.sender = "ME"
      }else {
        data.sender = auth.getUserRoles()[0] == "CUSTOMER" ? "COMPANY" : "CUSTOMER"
      }
      chatMessages.value.push(data);
    });
  }
};

const assignJob = (id: string) => {
  if (id.length === 24) {
    auth.authorizedRequest(`${config.backendUrl}/jobs/assign/${id}`, "PUT");
    emit("refetch-jobs");
    isJobDialogOpen.value = false;
  }
};

const unassignJob = (id: string) => {
  if (id.length === 24) {
    auth.authorizedRequest(`${config.backendUrl}/jobs/unassign/${id}`, "PUT");
    emit("refetch-jobs");
    isJobDialogOpen.value = false;
  }
};

const sendMessage = () => {
  if (currentMessage.value.trim() && selectedJob.value?._id) {
    chatService.sendMessage(selectedJob.value._id, currentMessage.value.trim());
    currentMessage.value = "";
  }
};

onMounted( () => {
  if(props.canOpenChat) {
    chatService.init();
  }
});

onUnmounted(() => {
  if(props.canOpenChat) {
    chatService.disconnect();
  }
});

watch(isJobDialogOpen, (isOpen) => {
  if (!isOpen) {
    chatMessages.value = [];
    chatService.disconnect();
  }
});
</script>
