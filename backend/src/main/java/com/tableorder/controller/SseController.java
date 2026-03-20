package com.tableorder.controller;

import com.tableorder.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;

    @GetMapping(value = "/orders", produces = "text/event-stream")
    public SseEmitter subscribe(@RequestParam Long storeId) {
        return sseService.subscribe(storeId);
    }
}
