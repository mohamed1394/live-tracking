package com.example.live.controller;

import com.example.live.model.CoordinateMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CoordinateController {

    private static final Logger logger = LoggerFactory.getLogger(CoordinateController.class);
    private final SimpMessagingTemplate messagingTemplate;

    public CoordinateController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/coords")
    public void handleCoords(CoordinateMessage message) {
        logger.info("Received coordinate: agentId={}, lat={}, lng={}", 
            message.getAgentId(), message.getLat(), message.getLng());
        messagingTemplate.convertAndSend("/topic/coords", message);
    }
}

