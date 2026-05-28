package com.flittly.bankendspringboot.dto;

import lombok.Data;
import java.util.List;

@Data
public class PageResult<T> {
    private List<T> data;
    private int total;
    private int limit;
    private int offset;

    public PageResult(List<T> data, int total, int limit, int offset) {
        this.data = data;
        this.total = total;
        this.limit = limit;
        this.offset = offset;
    }
}
